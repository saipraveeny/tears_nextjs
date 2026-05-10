export const PAYMENT_STATUS = {
  INITIATED: 'INITIATED',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  UNKNOWN: 'UNKNOWN',
} as const;

export const USER_ROLE = {
  ADMIN: 'admin',
  VIEWER: 'viewer'
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS;
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
