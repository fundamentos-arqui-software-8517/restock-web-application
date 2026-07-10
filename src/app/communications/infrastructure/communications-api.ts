import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeviceAlert } from '../domain/model/notification.entity';
import { StockThresholdAlert } from '../domain/model/stock-threshold-alert.entity';
import { NotificationListResponse, NotificationResource } from './notifications/notifications.response';
import { NotificationsAssembler } from './notifications/notifications.assembler';
import { NotificationsApiEndpoint } from './notifications/notifications-api-endpoint';
import { StockThresholdEvaluateResponse } from './stock-thresholds/stock-threshold-evaluate.response';
import { StockThresholdEvaluateAssembler } from './stock-thresholds/stock-threshold-evaluate.assembler';
import { StockThresholdEvaluateApiEndpoint } from './stock-thresholds/stock-threshold-evaluate-api-endpoint';

/**
 * HTTP facade for the Communications bounded context.
 * Exposes device-integrity alerts, in-app notifications,
 * and stock threshold evaluation.
 */
@Injectable({ providedIn: 'root' })
export class CommunicationsApi {
  private readonly http = inject(HttpClient);

  /**
   * Retrieves in-app notifications for a given recipient user.
   */
  getAlertsByRecipientUserId(recipientUserId: string): Observable<DeviceAlert[]> {
    return this.http
      .get<NotificationListResponse>(NotificationsApiEndpoint.byRecipientUserId(recipientUserId))
      .pipe(
        map(response => NotificationsAssembler.toEntityList(response.notifications)),
        catchError(() => of([])),
      );
  }

  /**
   * Triggers stock threshold evaluations for all custom supplies of the
   * specified account and returns the generated alerts.
   */
  evaluateStockThresholds(accountId: string): Observable<StockThresholdAlert[]> {
    return this.http
      .post<StockThresholdEvaluateResponse[]>(
        StockThresholdEvaluateApiEndpoint.evaluate(accountId),
        null,
      )
      .pipe(
        map(resources => StockThresholdEvaluateAssembler.toEntityList(resources)),
        catchError(() => of([])),
      );
  }
}
