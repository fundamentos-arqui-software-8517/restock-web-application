import { IssueType, SeverityType } from '../model/enums';


export interface CreateDeviceHealthCheckCommand {
  deviceId: string;
  signalStrengthInDbm: number;
  hardwareTemperature: number;
  issueType: IssueType | null;
  severity: SeverityType;
  needsMaintenance: boolean;
}
