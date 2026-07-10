/**
 * Represents the lifecycle status of a task.
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Represents the outcome of a stock comparison operation.
 */
export enum TaskResult {
  MATCHING = 'MATCHING',
  MISMATCHING = 'MISMATCHING',
  ANOMALY = 'ANOMALY',
}

/**
 * Represents the severity level of a stock discrepancy.
 */
export enum DiscrepancyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Represents the severity type for device health issues.
 */
export enum SeverityType {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Represents the type of issue detected in a device health check.
 */
export enum IssueType {
  SENSOR_MALFUNCTION = 'SENSOR_MALFUNCTION',
  CONNECTION_LOST = 'CONNECTION_LOST',
  HARDWARE_FAILURE = 'HARDWARE_FAILURE',
  OVERHEATING = 'OVERHEATING',
  BATTERY_LOW = 'BATTERY_LOW',
  CALIBRATION_ERROR = 'CALIBRATION_ERROR',
}
