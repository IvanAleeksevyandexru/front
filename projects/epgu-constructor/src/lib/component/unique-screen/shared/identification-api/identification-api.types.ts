import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

export interface PassportIdentificationRequestBody {
  passportInfo: UploadedFile
}

export interface PassportIdentificationResponse {
  status: string;
  description: string;
  faceId: string;
  errorCode: number;
  quality: ImageQuality;
}

export interface SelfieIdentificationRequestBody {
  selfie: UploadedFile;
  faceId: string;
}

export interface SelfieIdentificationResponse {
  status: string;
  description: string;
  faceId: string;
  selfieFaceId: string;
  errorCode: number;
  similarity: number;
  quality: ImageQuality;
}

export interface VideoIdentificationRequestBody {
  snapshot: UploadedFile;
  faceId: string;
  selfieFaceId: string;
}

export interface ImageQuality {
  blurriness: number;
  dark: number;
  illumination: number;
  specularity: number;
  light: number;
}

export interface VideoIdentificationResponse {
  status: string;
  description: string;
  faceId: string;
  selfieFaceId: string;
  videoFaceId: string;
  errorCode: number;
  similarity: number;
  quality: ImageQuality;
}


