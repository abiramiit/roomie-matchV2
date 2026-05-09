const calculateMatchScore = (profileA, profileB) => {
  let score = 0;
  let total = 0;

  // Location match (30 points)
  if (profileA.location?.city && profileB.location?.city) {
    total += 30;
    if (profileA.location.city.toLowerCase() === profileB.location.city.toLowerCase()) score += 30;
  }

  // Budget overlap (25 points)
  if (profileA.budget && profileB.budget) {
    total += 25;
    const aMin = profileA.budget.min, aMax = profileA.budget.max;
    const bMin = profileB.budget.min, bMax = profileB.budget.max;
    const overlapMin = Math.max(aMin, bMin);
    const overlapMax = Math.min(aMax, bMax);
    if (overlapMax >= overlapMin) {
      const overlapRange = overlapMax - overlapMin;
      const totalRange = Math.max(aMax, bMax) - Math.min(aMin, bMin);
      score += Math.round((overlapRange / (totalRange || 1)) * 25);
    }
  }

  const la = profileA.lifestyle || {};
  const lb = profileB.lifestyle || {};

  // Smoking (10 pts)
  total += 10;
  if (la.smoking === lb.smoking) score += 10;
  else if (la.smoking === 'no' && lb.smoking === 'occasionally') score += 5;
  else if (la.smoking === 'occasionally' && lb.smoking === 'no') score += 5;

  // Drinking (8 pts)
  total += 8;
  if (la.drinking === lb.drinking) score += 8;
  else if (la.drinking !== 'yes' && lb.drinking !== 'yes') score += 4;

  // Pets (7 pts)
  total += 7;
  if (la.pets === lb.pets) score += 7;
  else if (la.pets !== 'allergic' && lb.pets !== 'allergic') score += 3;

  // Sleep schedule (10 pts)
  total += 10;
  if (la.sleepSchedule === lb.sleepSchedule) score += 10;
  else if (la.sleepSchedule === 'flexible' || lb.sleepSchedule === 'flexible') score += 5;

  // Cleanliness (10 pts)
  total += 10;
  if (la.cleanliness && lb.cleanliness) {
    const diff = Math.abs(la.cleanliness - lb.cleanliness);
    score += Math.max(0, 10 - diff * 2);
  }

  return total > 0 ? Math.round((score / total) * 100) : 0;
};

module.exports = calculateMatchScore;
