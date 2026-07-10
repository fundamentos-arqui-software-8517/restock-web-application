import { HttpErrorResponse } from '@angular/common/http';

const GENERIC_MESSAGE = 'We could not complete the action. Please review the information and try again.';
const GENERIC_KEY = 'shared.errors.generic';

type TranslateFn = (key: string, params?: Record<string, string>) => string;

export interface UserErrorDescriptor {
  key: string;
  fallback: string;
  params?: Record<string, string>;
}

export function userErrorMessage(error: unknown, fallback = GENERIC_MESSAGE, translate?: TranslateFn): string {
  const descriptor = userErrorDescriptor(error, fallback);

  if (translate) {
    const translated = translate(descriptor.key, descriptor.params);
    return translated && translated !== descriptor.key ? translated : descriptor.fallback;
  }

  return descriptor.fallback;
}

export function userErrorDescriptor(error: unknown, fallback = GENERIC_MESSAGE): UserErrorDescriptor {
  const technicalMessage = readTechnicalMessage(error);
  const friendlyMessage = friendlyMessageFromText(technicalMessage);

  if (friendlyMessage) return friendlyMessage;

  if (error instanceof HttpErrorResponse) {
    return messageByStatus(error.status, fallback);
  }

  return descriptor(GENERIC_KEY, fallback);
}

function readTechnicalMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return readPayloadMessage(error.error) || error.message || '';
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    return readPayloadMessage(error);
  }

  return '';
}

function readPayloadMessage(payload: unknown): string {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return '';

  const record = payload as Record<string, unknown>;
  const directMessage = readString(record['message'])
    || readString(record['detail'])
    || readString(record['error']);

  if (directMessage) return directMessage;

  const errors = record['errors'];
  if (!errors || typeof errors !== 'object') return '';

  const first = Object.values(errors as Record<string, unknown>)[0];
  if (Array.isArray(first)) {
    return first.filter((item): item is string => typeof item === 'string').join(', ');
  }

  return typeof first === 'string' ? first : '';
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function friendlyMessageFromText(message: string): UserErrorDescriptor | null {
  const text = message.toLowerCase();

  if (!text.trim()) return null;

  if (text.includes('current stock') && (text.includes('less than or equal') || text.includes('maximum'))) {
    const limit = findFirstNumber(message);
    return limit
      ? descriptor(
          'shared.errors.stockAboveMax',
          `The initial stock is above the configured maximum (${limit}). Please enter a lower amount.`,
          { limit },
        )
      : descriptor(
          'shared.errors.stockAboveMaxNoLimit',
          'The initial stock is above the configured maximum. Please enter a lower amount.',
        );
  }

  if (text.includes('initial stock') && text.includes('between')) {
    return descriptor('shared.errors.stockOutsideRange', 'The initial stock is outside the allowed range for this supply.');
  }

  if (text.includes('expiration date') && text.includes('required')) {
    return descriptor('shared.errors.expirationRequired', 'This supply expires, so an expiration date is required.');
  }

  if (text.includes('expiration date') && text.includes('past')) {
    return descriptor('shared.errors.expirationPast', 'The expiration date cannot be earlier than today.');
  }

  if (text.includes('branch') && text.includes('belong')) {
    return descriptor('shared.errors.branchAccountMismatch', 'Please choose a branch from the current account.');
  }

  if (text.includes('branch') && text.includes('not found')) {
    return descriptor('shared.errors.branchUnavailable', 'The selected branch is no longer available. Please refresh and choose another one.');
  }

  if (text.includes('custom supply') && text.includes('supplyid') && text.includes('already exists')) {
    return descriptor('shared.errors.baseSupplyDuplicate', 'This base supply is already registered for this account.');
  }

  if (text.includes('custom supply') && text.includes('already exists')) {
    return descriptor('shared.errors.supplyNameDuplicate', 'A supply with this name already exists for this account.');
  }

  if (text.includes('custom supply') && text.includes('not found')) {
    return descriptor('shared.errors.supplyUnavailable', 'The selected supply is no longer available. Please refresh and choose another one.');
  }

  if (text.includes('supply not found')) {
    return descriptor('shared.errors.supplyUnavailable', 'The selected supply is no longer available. Please refresh and choose another one.');
  }

  if (text.includes('unsupported currency')) {
    return descriptor('shared.errors.unsupportedCurrency', 'Please choose a supported currency.');
  }

  if (text.includes('amount must be non-negative') || text.includes('cannot be negative')) {
    return descriptor('shared.errors.nonNegative', 'Please enter a value of zero or greater.');
  }

  if (text.includes('validation') || text.includes('required') || text.includes('notblank') || text.includes('not null')) {
    return descriptor('shared.errors.requiredFields', 'Please complete the required fields before continuing.');
  }

  if (text.includes('duplicate') || text.includes('already exists')) {
    return descriptor('shared.errors.duplicate', 'This record already exists. Please use different information.');
  }

  return null;
}

function messageByStatus(status: number, fallback: string): UserErrorDescriptor {
  if (status === 400) return descriptor('shared.errors.badRequest', 'Some information is invalid. Please review the form and try again.');
  if (status === 403) return descriptor('shared.errors.forbidden', 'You do not have permission to perform this action.');
  if (status === 404) return descriptor('shared.errors.notFound', 'The requested information is no longer available.');
  if (status === 409) return descriptor('shared.errors.conflict', 'There is already conflicting information saved. Please review your data.');
  if (status >= 500) return descriptor('shared.errors.server', 'The service is temporarily unavailable. Please try again in a moment.');
  return descriptor(GENERIC_KEY, fallback);
}

function findFirstNumber(message: string): string {
  return message.match(/\d+(?:\.\d+)?/)?.[0] ?? '';
}

function descriptor(key: string, fallback: string, params?: Record<string, string>): UserErrorDescriptor {
  return { key, fallback, params };
}
