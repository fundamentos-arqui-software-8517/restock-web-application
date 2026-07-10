import { Injectable, computed, signal } from '@angular/core';

export type AlertTone = 'success' | 'warning' | 'error' | 'info';

export interface AppAlert {
  id: number;
  tone: AlertTone;
  message?: string;
  messageKey?: string;
  params?: Record<string, string | number>;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly alertsState = signal<AppAlert[]>([]);
  private nextId = 1;

  readonly alerts = computed(() => this.alertsState());

  success(message: string): void {
    this.show(message, 'success');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  successKey(key: string, params?: Record<string, string | number>): void {
    this.showKey(key, 'success', params);
  }

  warningKey(key: string, params?: Record<string, string | number>): void {
    this.showKey(key, 'warning', params);
  }

  errorKey(key: string, params?: Record<string, string | number>): void {
    this.showKey(key, 'error', params);
  }

  infoKey(key: string, params?: Record<string, string | number>): void {
    this.showKey(key, 'info', params);
  }

  show(message: string, tone: AlertTone = 'info'): void {
    const cleanMessage = message?.trim();
    if (!cleanMessage) return;

    this.push({ message: cleanMessage, tone });
  }

  showKey(key: string, tone: AlertTone = 'info', params?: Record<string, string | number>): void {
    const cleanKey = key?.trim();
    if (!cleanKey) return;

    this.push({ messageKey: cleanKey, params, tone });
  }

  dismiss(id: number): void {
    this.alertsState.update((alerts) => alerts.filter((alert) => alert.id !== id));
  }

  private push(alertData: Omit<AppAlert, 'id'>): void {
    const alert: AppAlert = {
      id: this.nextId++,
      ...alertData,
    };

    this.alertsState.update((alerts) => [...alerts.slice(-3), alert]);
    window.setTimeout(() => this.dismiss(alert.id), alert.tone === 'error' ? 6500 : 4500);
  }
}
