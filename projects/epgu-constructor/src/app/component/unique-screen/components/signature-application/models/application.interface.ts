export interface SignatureApplicationData {
  url: string;
  userId: number;
  operationID: string;
  fileAccessCodes: string[];
  alreadySigned: boolean;
}
