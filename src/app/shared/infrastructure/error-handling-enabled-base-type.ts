import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { userErrorMessage } from './user-error-message';

/**
 * Provides reusable HTTP error translation for infrastructure services.
 *
 * @remarks
 * This type is intended for `*-api` endpoint clients that integrate with
 * external systems from the infrastructure layer.
 */
export abstract class ErrorHandlingEnabledBaseType {
  /**
   * Creates an operation-specific HTTP error handler.
   * @param operation - Name of the failed operation.
   * @returns Function that transforms an {@link HttpErrorResponse} into a failed observable.
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      const errorMessage = userErrorMessage(error, operation);
      return throwError(() => new Error(errorMessage));
    };
  }
}
