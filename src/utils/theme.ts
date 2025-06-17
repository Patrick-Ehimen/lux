/**
 * Get a color based on percentage value (for heatmaps)
 * @param {number} percent - Percentage value
 * @returns {string} HEX color code
 */
export const getPercentColor = (percent:any) => {
  if (percent === 0) return "#808080"; // Gray for neutral
  if (percent > 0) {
    // Green scale for positive
    if (percent > 50) return "#00a53c"; // Strong green
    if (percent > 20) return "#2cb357"; // Medium green
    if (percent > 5) return "#48c172"; // Light green
    return "#7ad69c"; // Very light green
  } else {
    // Red scale for negative
    const absPercent = Math.abs(percent);
    if (absPercent > 50) return "#e50000"; // Strong red
    if (absPercent > 20) return "#ff3333"; // Medium red
    if (absPercent > 5) return "#ff6666"; // Light red
    return "#ff9999"; // Very light red
  }
};
