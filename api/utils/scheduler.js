const { addDays, isWeekend, nextSaturday, startOfDay, isSameDay } = require('date-fns');

const REVISION_INTERVALS = [1, 3, 7, 14, 30, 60]; // Day 1, 3, 7, 14...

/**
 * Calculates the next revision date for a problem.
 * Ensures the date falls on a weekend and balances load.
 */
async function scheduleNextRevision(dateSolved, revisionCount = 0, problems = []) {
  const interval = REVISION_INTERVALS[revisionCount] || (30 * (revisionCount - 3));
  let targetDate = addDays(startOfDay(dateSolved), interval);

  // If not weekend, move to next Saturday
  if (!isWeekend(targetDate)) {
    targetDate = nextSaturday(targetDate);
  }

  // Ensure it's not the same weekend OR immediately following if solved recently
  // We want at least a 5-day gap to ensure it hits the NEXT weekend cycle
  const minGap = 5 * 24 * 60 * 60 * 1000;
  if (targetDate - startOfDay(dateSolved) < minGap) {
    targetDate = nextSaturday(addDays(targetDate, 1));
  }

  // Load balancing logic: always pick the weekend day with fewer tasks
  const saturday = startOfDay(isWeekend(targetDate) && targetDate.getDay() === 6 ? targetDate : nextSaturday(targetDate));
  const sunday = addDays(saturday, 1);
  
  const satCount = problems.filter(p => isSameDay(new Date(p.nextRevisionDate), saturday)).length;
  const sunCount = problems.filter(p => isSameDay(new Date(p.nextRevisionDate), sunday)).length;

  if (sunCount < satCount) {
    return sunday;
  }
  
  return saturday;
}

module.exports = { scheduleNextRevision };
