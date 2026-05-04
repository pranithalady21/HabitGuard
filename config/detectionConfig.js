/**
 * Configuration file for suspicious behavior detection thresholds
 * 
 * Modify these values to adjust the sensitivity of the detection system
 */

module.exports = {
  // RAPID_UPDATES Detection
  // Detects when a user marks a habit as completed too many times in a short period
  rapidUpdates: {
    enabled: true,
    timeWindowMs: 5 * 60 * 1000, // 5 minutes window
    maxUpdatesInWindow: 5, // 5 or more updates triggers warning
    severity: 'HIGH',
    description: 'Too many completions in a short time period',
  },

  // UNREALISTIC_STREAK Detection
  // Detects when a user has an unusually long streak with zero missed days
  unrealisticStreak: {
    enabled: true,
    minConsecutiveDays: 30, // 30+ days triggers warning
    toleranceMs: 2 * 60 * 60 * 1000, // 2 hours tolerance for timezone variations
    dayMs: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    severity: 'MEDIUM',
    description: 'Perfect streak without any missed days is statistically unlikely',
  },

  // DUPLICATE_TIMESTAMPS Detection
  // Detects when multiple completions have identical exact timestamps
  duplicateTimestamps: {
    enabled: true,
    minDuplicates: 3, // 3 or more identical timestamps triggers warning
    severity: 'HIGH',
    description: 'Multiple completions with identical timestamps suggest manipulation',
  },

  // UNUSUAL_TIME_PATTERN Detection
  // Detects when all completions happen at the same hour of day
  unusualTimePattern: {
    enabled: true,
    maxUniqueHours: 2, // 2 or fewer unique hours triggers warning
    minCompletions: 5, // Need at least 5 completions to trigger
    severity: 'MEDIUM',
    description: 'All completions at same time of day suggest automated completion',
  },

  // Global settings
  global: {
    storeWarningsInDatabase: true, // Keep history of all warnings
    returnWarningsInResponse: true, // Include warnings in API response
  },
};
