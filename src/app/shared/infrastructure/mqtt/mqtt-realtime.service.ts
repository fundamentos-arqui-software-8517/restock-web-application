import { Injectable, inject } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable, map } from 'rxjs';

export interface DeviceMqttUpdate {
  deviceId: string;
  macAddress: string;
  status: string;
  branchId: string;
  assignedBatchId: string;
  netWeight: number | null;
  grossWeight: number | null;
  tareWeight: number | null;
  weightUnitName: string | null;
  weightUnitAbbr: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MqttRealtimeService {
  private readonly mqtt = inject(MqttService);

  /**
   * Listen to real-time inventory updates from the MQTT broker.
   */
  getDeviceUpdates(): Observable<DeviceMqttUpdate> {
    return this.mqtt.observe('restock/inventory/updates').pipe(
      map((message: IMqttMessage) => {
        const payloadStr = message.payload.toString();
        return JSON.parse(payloadStr) as DeviceMqttUpdate;
      })
    );
  }
}
