import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

export interface PassportIdentificationRequestBody {
  passportInfo: UploadedFile
}

export interface PassportIdentificationResponse {
  status: string;
  description: string;
  faceId: string;
}

export interface SelfieIdentificationRequestBody {
  selfie: UploadedFile;
  faceId: string;
}

export interface SelfieIdentificationResponse {
  status: string;
  description: string;
  faceIds: string[];
}

export interface VideoIdentificationRequestBody {
  snapshot: UploadedFile;
  faceIds: string[];
}

export interface VideoIdentificationResponse {
  status: string;
}


