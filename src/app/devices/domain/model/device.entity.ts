import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { DeviceStatus } from './device-status';

export class Device implements BaseEntity {
  private _id: string;
  private _accountId: string;
  private _macAddress: string;
  private _description: string;
  private _status: DeviceStatus;
  private _manufacturer: string | null;
  private _model: string | null;
  private _firmwareVersion: string | null;
  private _branchId: string | null;
  private _assignedBatchId: string | null;
  private _supplyThresholdId: string | null;
  private _netWeight: number | null;
  private _tareWeight: number | null;
  private _grossWeight: number | null;
  private _calibrationDate: string | null;
  private _weightUnitName: string | null;
  private _weightUnitAbbreviation: string | null;
  private _justifiedWithdrawnStock: number;

  constructor(props: {
    id: string;
    accountId: string;
    macAddress: string;
    description: string;
    status: DeviceStatus;
    manufacturer: string | null;
    model: string | null;
    firmwareVersion: string | null;
    branchId: string | null;
    assignedBatchId: string | null;
    supplyThresholdId: string | null;
    netWeight: number | null;
    tareWeight: number | null;
    grossWeight: number | null;
    calibrationDate: string | null;
    weightUnitName: string | null;
    weightUnitAbbreviation: string | null;
    justifiedWithdrawnStock: number;
  }) {
    this._id = props.id;
    this._accountId = props.accountId;
    this._macAddress = props.macAddress;
    this._description = props.description;
    this._status = props.status;
    this._manufacturer = props.manufacturer;
    this._model = props.model;
    this._firmwareVersion = props.firmwareVersion;
    this._branchId = props.branchId;
    this._assignedBatchId = props.assignedBatchId;
    this._supplyThresholdId = props.supplyThresholdId;
    this._netWeight = props.netWeight;
    this._tareWeight = props.tareWeight;
    this._grossWeight = props.grossWeight;
    this._calibrationDate = props.calibrationDate;
    this._weightUnitName = props.weightUnitName;
    this._weightUnitAbbreviation = props.weightUnitAbbreviation;
    this._justifiedWithdrawnStock = props.justifiedWithdrawnStock;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }
  get accountId(): string { return this._accountId; }
  get macAddress(): string { return this._macAddress; }
  get description(): string { return this._description; }
  get status(): DeviceStatus { return this._status; }
  set status(value: DeviceStatus) { this._status = value; }
  get manufacturer(): string | null { return this._manufacturer; }
  get model(): string | null { return this._model; }
  get firmwareVersion(): string | null { return this._firmwareVersion; }
  get branchId(): string | null { return this._branchId; }
  get assignedBatchId(): string | null { return this._assignedBatchId; }
  get supplyThresholdId(): string | null { return this._supplyThresholdId; }
  get netWeight(): number | null { return this._netWeight; }
  get tareWeight(): number | null { return this._tareWeight; }
  get grossWeight(): number | null { return this._grossWeight; }
  get calibrationDate(): string | null { return this._calibrationDate; }
  get weightUnitName(): string | null { return this._weightUnitName; }
  get weightUnitAbbreviation(): string | null { return this._weightUnitAbbreviation; }
  get justifiedWithdrawnStock(): number { return this._justifiedWithdrawnStock; }
  set justifiedWithdrawnStock(value: number) { this._justifiedWithdrawnStock = value; }
}
