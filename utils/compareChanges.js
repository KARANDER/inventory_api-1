/**
 * Helper function to compare old and new values and return changes object
 * 
 * @param {Object} oldValues - The original record values
 * @param {Object} newValues - The updated record values
 * @param {Array} fieldsToTrack - Optional array of field names to track (if not provided, tracks all changed fields)
 * @returns {Object} Object with changed fields: { fieldName: { old: value, new: value } }
 */
const compareChanges = (oldValues, newValues, fieldsToTrack = null) => {
  if (!oldValues || !newValues) return null;

  const changes = {};
  const fields = fieldsToTrack || Object.keys(newValues);

  for (const field of fields) {
    const oldVal = oldValues[field];
    const newVal = newValues[field];

    // Skip if field doesn't exist in old values or if values are the same
    if (oldVal === undefined || oldVal === newVal) continue;

    // Handle null/undefined comparisons
    if ((oldVal === null || oldVal === undefined) && (newVal === null || newVal === undefined)) continue;

    // Convert dates to strings for comparison if needed
    const oldStr = oldVal instanceof Date ? oldVal.toISOString() : oldVal;
    const newStr = newVal instanceof Date ? newVal.toISOString() : newVal;

    if (oldStr !== newStr) {
      changes[field] = {
        old: oldVal,
        new: newVal
      };
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
};

module.exports = { compareChanges };

