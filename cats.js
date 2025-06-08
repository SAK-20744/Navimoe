
// cats.js - Extended with boxing support

function getBoxingMultiplier(part) {
  if (!part.boxing || part.boxing.length === 0) return 1;

  const hasExclusive = part.boxing.some(val => val === 90 || val === 150);
  if (hasExclusive && part.boxing.length > 1) return 1; // invalid combo, ignore

  const sum = part.boxing.reduce((a, b) => a + b, 0);
  if (sum > 120) return 1; // invalid amount, ignore

  return part.boxing.reduce((acc, val) => acc * (1 + val / 100), 1);
}

// Example stat calculation using the multiplier
function calculatePartStats(part) {
  const base = part.hp || part.atk || 0;
  const multiplier = getBoxingMultiplier(part);
  return base * multiplier;
}

// Export for use
if (typeof module !== 'undefined') {
  module.exports = {
    getBoxingMultiplier,
    calculatePartStats
  };
}
