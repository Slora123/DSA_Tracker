const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const conceptMap = require('../utils/conceptMap');

router.get('/concepts', (req, res) => {
  const concepts = Object.keys(conceptMap).sort();
  res.json(concepts);
});

router.get('/search', async (req, res) => {
  const { concept, difficulty } = req.query;
  const searchTerm = concept ? concept.toLowerCase().trim() : "";
  
  try {
    const neetcodePath = path.join(__dirname, '../data/neetcode150.json');
    const extrasPath = path.join(__dirname, '../data/leetcode_extras.json');
    
    const [neetcodeRaw, extrasRaw] = await Promise.all([
      fs.readFile(neetcodePath, 'utf8'),
      fs.readFile(extrasPath, 'utf8').catch(() => '{}')
    ]);
    
    const neetcodeData = JSON.parse(neetcodeRaw);
    const extrasData = JSON.parse(extrasRaw);
    
    // Find related keywords, checking both keys (case-insensitive) and values in the concept map
    let relatedKeywords = [searchTerm];
    const actualKey = Object.keys(conceptMap).find(k => k.toLowerCase() === searchTerm);
    
    if (actualKey) {
      relatedKeywords = [actualKey, ...conceptMap[actualKey]];
    } else {
      for (const [key, values] of Object.entries(conceptMap)) {
        if (values.some(v => v.toLowerCase() === searchTerm)) {
          relatedKeywords = [key, ...values];
          break;
        }
      }
    }
    
    // Deduplicate related keywords
    relatedKeywords = Array.from(new Set(relatedKeywords.map(k => k.toLowerCase())));
    
    let neetcodeTop = [];
    let extrasTop = [];
    let categoriesMatched = new Set();
    
    // First Pass: Specific Matches from NeetCode 150
    Object.entries(neetcodeData).forEach(([category, problems]) => {
      Object.entries(problems).forEach(([name, info]) => {
        const matchesTerm = name.toLowerCase().includes(searchTerm) || 
                            category.toLowerCase().includes(searchTerm);
        const matchesRelated = relatedKeywords.some(keyword => 
          name.toLowerCase().includes(keyword.toLowerCase()) || 
          category.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchesTerm || matchesRelated) {
          const matchesDifficulty = !difficulty || info.difficulty === difficulty;
          if (matchesDifficulty) {
            neetcodeTop.push({
              name,
              difficulty: info.difficulty,
              link: info.url,
              tags: [category]
            });
            categoriesMatched.add(category);
          }
        }
      });
    });

    // Second Pass: Specific Matches from Extras
    Object.entries(extrasData).forEach(([category, problems]) => {
      Object.entries(problems).forEach(([name, info]) => {
        const matchesTerm = name.toLowerCase().includes(searchTerm) || 
                            category.toLowerCase().includes(searchTerm);
        const matchesRelated = relatedKeywords.some(keyword => 
          name.toLowerCase().includes(keyword.toLowerCase()) || 
          category.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchesTerm || matchesRelated) {
          const matchesDifficulty = !difficulty || info.difficulty === difficulty;
          if (matchesDifficulty) {
            extrasTop.push({
              name,
              difficulty: info.difficulty,
              link: info.url,
              tags: [category]
            });
            categoriesMatched.add(category);
          }
        }
      });
    });

    // Deduplicate Top matches
    neetcodeTop = Array.from(new Map(neetcodeTop.map(item => [item.name, item])).values());
    extrasTop = Array.from(new Map(extrasTop.map(item => [item.name, item])).values());

    // Third Pass: Related Problems in categories
    let relatedMatches = [];
    categoriesMatched.forEach(category => {
      const combinedCategory = { ...(neetcodeData[category] || {}), ...(extrasData[category] || {}) };
      Object.entries(combinedCategory).forEach(([name, info]) => {
        const isTop = neetcodeTop.some(m => m.name === name) || extrasTop.some(m => m.name === name);
        if (!isTop) {
          const matchesDifficulty = !difficulty || info.difficulty === difficulty;
          if (matchesDifficulty) {
            relatedMatches.push({
              name,
              difficulty: info.difficulty,
              link: info.url,
              tags: [category]
            });
          }
        }
      });
    });

    res.json({
      neetcodeTop,
      extrasTop,
      relatedMatches
    });
  } catch (err) {
    console.error('NeetCode search error:', err.message);
    res.status(500).json({ message: 'Failed to search NeetCode data' });
  }
});

module.exports = router;
