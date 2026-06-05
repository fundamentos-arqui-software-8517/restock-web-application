import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a user device within the Device Management domain.
 *
 * @remarks
 * This entity models the concept of a device that can be managed, monitored, and associated with supplies.
 * It includes properties such as the device's unique identifier, MAC address, assigned supply name, network state, and sensor health percentage.
 */
export class Device implements BaseEntity {
  /**
   * The unique identifier for the device
   * @defaultValue ''
   */
  private _id: string;

  /**
   * The MAC address of the device
   * @defaultValue ''
   */
  private _macAddress: string;

  /**
   * The name of the supply assigned to the device
   * @defaultValue ''
   */
  private _assignedSupplyName: string;

  /**
   * The current network state of the device
   * @defaultValue ''
   */
  private _networkState: string;

  /**
   * The health percentage of the device's sensor
   * @defaultValue 0
   */
  private _sensorHealthPercentage: number;

  /**
   * Creates an instance of Device entity.
   *
   * @param props - Initialization properties
   * @param props.id = The unique identifier for the device
   * @param props.macAddress - The mac address for the device
   * @param props.assignedSupplyName - The name of the assigned supply for the device to track data
   * @param props.networkState - The current network state for the device. It can be ONLINE, OFFLINE, UNSTABLE.
   * @param props.sensorHealthPercentage - The current device health percentage based on the sensors health.
   */
  constructor(props: {
    id: string;
    macAddress: string;
    assignedSupplyName: string;
    networkState: string;
    sensorHealthPercentage: number;
  }) {
    this._id = props.id;
    this._macAddress = props.macAddress;
    this._assignedSupplyName = props.assignedSupplyName;
    this._networkState = props.networkState;
    this._sensorHealthPercentage = props.sensorHealthPercentage;
  }

  /**
   * Gets the unique identifier of this device.
   *
   * @returns The device's unique identifier.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets a value for the unique identifier of this device.
   *
   * @param value - The new value identifier for this device.
   */
  set id(value: string) {
    this._id = value;
  }

  /**
   * Gets the mac address associated with this device.
   *
   * @returns The device's mac address.
   */
  get macAddress(): string {
    return this._macAddress;
  }

  /**
   * Gets the name of the assigned supply for this device.
   *
   * @returns The device's current supply assigned name.
   */
  get assignedSupplyName(): string {
    return this._assignedSupplyName;
  }

  /**
   * Sets a new name for the supply assigned to this device.
   *
   * @param value - The new name for the supply assigned to this device.
   */
  set assignedSupplyName(value: string) {
    this._macAddress = value;
  }

  /**
   * Gets the current network state value for this device.
   *
   * @returns the current network state for this device.
   */
  get networkState(): string {
    return this._networkState;
  }

  /**
   * Sets the current value of the network state of this device.
   *
   * @param value - The new value for the network state of this device.
   */
  set networkState(value: string) {
    this._networkState = value;
  }

  /**
   * Gets the current device health percentage.
   *
   * @returns The current device health percentage.
   */
  get sensorHealthPercentage(): number {
    return this._sensorHealthPercentage;
  }

  /**
   * Sets a new value for the device health percentage.
   *
   * @param value - The new value for the device health percentage.
   */
  set sensorHealthPercentage(value: number) {
    this._sensorHealthPercentage = value;
  }
}
