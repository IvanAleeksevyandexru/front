import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';

@Injectable()
export class InvitationErrorServiceStub {
  requestOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  post<T>(path: string, body: T, attrs: ComponentAttrsDto) {
    this.http
      .post<{ errorCode: number; errorMessage: string }>(path, body, this.requestOptions)
      .subscribe();
  }

  openModal() {}
}
