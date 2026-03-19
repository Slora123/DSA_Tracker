const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');
const { scheduleNextRevision } = require('../utils/scheduler');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Create or update a problem
router.post('/', async (req, res) => {
  try {
    const { name, platform, concept, difficulty, leetcodeLink, dateSolved } = req.body;
    const solvedDate = dateSolved ? new Date(dateSolved) : new Date();
    const solvedDateISO = solvedDate.toISOString().split('T')[0];
    
    // Check if the same problem was solved yesterday or today
    const checkQuery = `
      SELECT * FROM problems 
      WHERE user_id = $1 AND name = $2 AND platform = $3 
      AND (date_solved::text LIKE $4 OR date_solved::text LIKE $5)
    `;
    const yesterday = new Date(solvedDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    const { rows: existingRows } = await query(checkQuery, [
      req.user.id, name, platform, yesterdayISO + '%', solvedDateISO + '%'
    ]);

    if (existingRows.length > 0) {
      const problem = existingRows[0];
      const history = problem.solve_history || [];
      
      const alreadyLoggedToday = history.some(d => d.startsWith(solvedDateISO));
      if (!alreadyLoggedToday) {
        history.push(solvedDate.toISOString());
      }

      const nextRevisionDate = await scheduleNextRevision(solvedDate, problem.revision_count || 0, []);
      
      const updateQuery = `
        UPDATE problems 
        SET date_solved = $1, solve_history = $2, days_taken = $3, next_revision_date = $4
        WHERE id = $5
        RETURNING *
      `;
      const { rows: updatedRows } = await query(updateQuery, [
        solvedDate, JSON.stringify(history), history.length, nextRevisionDate, problem.id
      ]);
      return res.status(200).json(updatedRows[0]);
    }

    // New problem
    const nextRevisionDate = await scheduleNextRevision(solvedDate, 0, []);
    const id = uuidv4();
    const insertQuery = `
      INSERT INTO problems (id, user_id, name, platform, concept, difficulty, leetcode_link, date_solved, solve_history, days_taken, next_revision_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const { rows } = await query(insertQuery, [
      id, req.user.id, name, platform, concept, difficulty, leetcodeLink, 
      solvedDate, JSON.stringify([solvedDate.toISOString()]), 1, nextRevisionDate
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all problems
router.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM problems WHERE user_id = $1 ORDER BY date_solved DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update revision status
router.patch('/:id/revise', async (req, res) => {
  try {
    const { rows: problemRows } = await query('SELECT * FROM problems WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (problemRows.length === 0) return res.status(404).json({ message: 'Problem not found' });

    const problem = problemRows[0];
    const newCount = (problem.revision_count || 0) + 1;
    const nextDate = await scheduleNextRevision(new Date(), newCount, []);

    const updateQuery = `
      UPDATE problems 
      SET revision_count = $1, next_revision_date = $2, completed = FALSE
      WHERE id = $3
      RETURNING *
    `;
    const { rows: updatedRows } = await query(updateQuery, [newCount, nextDate, req.params.id]);
    res.json(updatedRows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a problem
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM problems WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const { rows: problems } = await query('SELECT * FROM problems WHERE user_id = $1', [req.user.id]);
    
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const revisionPending = isWeekend ? problems.filter(p => new Date(p.next_revision_date) <= now).length : 0;
    
    res.json({ 
      totalSolved: problems.length, 
      revisionPending, 
      streak: 0 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
