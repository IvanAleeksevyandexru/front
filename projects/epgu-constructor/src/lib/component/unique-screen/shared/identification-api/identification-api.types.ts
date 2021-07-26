import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

export interface PassportIdentificationRequestBody {
  passportInfo: UploadedFile
}

export interface PassportIdentificationResponse {
  response: {
    items: {[key: string]: string }
  }
}

export interface SelfieIdentificationRequestBody {
  selfie: UploadedFile;
  faceId: string;
}

export interface SelfieIdentificationResponse {

}

export interface VideoIdentificationRequestBody {
  snapshot: UploadedFile;
  faceIds: string[];
}

export interface VideoIdentificationResponse {

}


