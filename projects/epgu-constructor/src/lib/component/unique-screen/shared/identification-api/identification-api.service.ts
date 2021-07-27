import { Injectable } from '@angular/core';
import {
  ConfigService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  PassportIdentificationRequestBody,
  PassportIdentificationResponse,
  SelfieIdentificationRequestBody,
  SelfieIdentificationResponse,
  VideoIdentificationRequestBody,
  VideoIdentificationResponse,
} from './identification-api.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class IdentificationApiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {}

  passportIdentification(passportRequestBody: PassportIdentificationRequestBody): Observable<PassportIdentificationResponse> {
    const url = `${this.configService.identificationApiUrl}/passport`;
    return this.http.post<PassportIdentificationResponse>(url, passportRequestBody);
  }

  selfieIdentification(selfieRequestBody: SelfieIdentificationRequestBody): Observable<SelfieIdentificationResponse> {
    const url = `${this.configService.identificationApiUrl}/selfie`;
    return this.http.post<SelfieIdentificationResponse>(url, selfieRequestBody);
  }

  videoIdentification(videoRequestBody: VideoIdentificationRequestBody): Observable<VideoIdentificationResponse> {
    const url = `${this.configService.identificationApiUrl}/video`;
    return this.http.post<VideoIdentificationResponse>(url, videoRequestBody);
  }
}
