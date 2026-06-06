import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class DeviceThreshold implements BaseEntity {
  private _id: string;
  private _accountId: string;
  private _customSupplyId: string;
  private _minStock: number;
  private _maxStock: number;
  private _anomalyThreshold: number;
  private _minTemperature: number | null;
  private _maxTemperature: number | null;
  private _minHumidity: number | null;
  private _maxHumidity: number | null;

  constructor(props: {
    id: string;
    accountId: string;
    customSupplyId: string;
    minStock: number;
    maxStock: number;
    anomalyThreshold: number;
    minTemperature: number | null;
    maxTemperature: number | null;
    minHumidity: number | null;
    maxHumidity: number | null;
  }) {
    this._id = props.id;
    this._accountId = props.accountId;
    this._customSupplyId = props.customSupplyId;
    this._minStock = props.minStock;
    this._maxStock = props.maxStock;
    this._anomalyThreshold = props.anomalyThreshold;
    this._minTemperature = props.minTemperature;
    this._maxTemperature = props.maxTemperature;
    this._minHumidity = props.minHumidity;
    this._maxHumidity = props.maxHumidity;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }
  get accountId(): string { return this._accountId; }
  get customSupplyId(): string { return this._customSupplyId; }
  get minStock(): number { return this._minStock; }
  get maxStock(): number { return this._maxStock; }
  get anomalyThreshold(): number { return this._anomalyThreshold; }
  get minTemperature(): number | null { return this._minTemperature; }
  get maxTemperature(): number | null { return this._maxTemperature; }
  get minHumidity(): number | null { return this._minHumidity; }
  get maxHumidity(): number | null { return this._maxHumidity; }
}
