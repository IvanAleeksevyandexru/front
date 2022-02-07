import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';

export interface Invite {
  orderId?: number;
  id?: number;
  organizations?: { orgId: string; areas: string[] }[];
  endDate?: string;
  startDate?: string;
}

@Injectable()
export class InviteService {
  get path(): string {
    return `${this.config.invitationUrl}/invitations/checkOrder`;
  }

  constructor(private http: HttpClient, private config: ConfigService) {}

  getInvite(parentOrderId: string, bookId?: string): Observable<Invite> {
    let params = new HttpParams().append('parentOrderId', parentOrderId);
    if (bookId) {
      params = params.append('bookId', bookId);
    }

    return this.http.get<Invite>(this.path, { params, withCredentials: true });
  }
}
