import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

export interface PassportIdentificationRequestBody {
  passportInfo: UploadedFile;
}

export interface QualityResponse {
  quality: ImageQuality;
  similarity?: number;
  similarityFaceId?: number;
  similaritySelfieFaceId?: number;
}

export interface PassportIdentificationResponse extends QualityResponse {
  status: string;
  description: string;
  faceId: string;
  errorCode: number;
}

export interface SelfieIdentificationRequestBody {
  selfie: UploadedFile;
  faceId: string;
}

export interface SelfieIdentificationResponse extends QualityResponse {
  status: string;
  description: string;
  faceId: string;
  selfieFaceId: string;
  errorCode: number;
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

export interface VideoIdentificationResponse extends QualityResponse {
  status: string;
  description: string;
  faceId: string;
  selfieFaceId: string;
  videoFaceId: string;
  errorCode: number;
}

export const simplifyQualityTransform = <T extends QualityResponse>(data: T) => {
  const quality = { ...data.quality };
  const result = { ...data };
  Object.entries(quality).forEach((item) => (quality[item[0]] = Math.round(item[1] * 100)));
  result.quality = quality;

  if (result?.similarity) {
    result.similarity = Math.round(result.similarity * 100);
  }
  if (result?.similarityFaceId) {
    result.similarityFaceId = Math.round(result.similarityFaceId * 100);
  }
  if (result?.similarity) {
    result.similaritySelfieFaceId = Math.round(result.similaritySelfieFaceId * 100);
  }

  return result;
};
