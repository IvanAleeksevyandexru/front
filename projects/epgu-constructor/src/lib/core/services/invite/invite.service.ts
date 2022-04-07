import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from '../../../screen/screen.service';
import { catchError, concatMap, delayWhen, filter, finalize, tap } from 'rxjs/operators';
import {
  DictionaryConditions,
  DictionaryFilters,
  DictionaryOptions,
  DictionarySubFilter,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';

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

  private processStatus: BehaviorSubject<Record<string, true>> = new BehaviorSubject<
    Record<string, true>
  >({});

  private cache: Record<string, Invite> = {};

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private route: ActivatedRoute,
    private screenService: ScreenService,
  ) {}

  setFilterOptions(invite: Invite, options: DictionaryOptions): DictionaryOptions {
    const result = { ...options } as DictionaryFilters;
    if (invite?.organizations?.length > 0) {
      if (this.screenService?.component?.attrs?.orgKeyName) {
        if (result.filter?.simple) {
          const simpleFilter = (result.filter.simple as unknown) as DictionarySubFilter;
          result.filter = {
            union: {
              unionKind: DictionaryUnionKind.AND,
              subs: [simpleFilter],
            },
          };
        }
        if (!result.filter?.union) {
          result.filter = {
            union: {
              unionKind: DictionaryUnionKind.AND,
              subs: [],
            },
          };
        }
        const filterOptions = result.filter.union;

        if (invite?.organizations?.length == 1) {
          filterOptions.subs.push({
            simple: {
              attributeName: this.screenService.component.attrs.orgKeyName,
              condition: DictionaryConditions.EQUALS,
              value: {
                asString: invite?.organizations[0].orgId,
              },
            },
          });
        } else {
          filterOptions.subs.push(({
            union: {
              unionKind: DictionaryUnionKind.OR,
              subs: invite?.organizations.map(({ orgId }) => ({
                simple: {
                  attributeName: this.screenService.component.attrs.orgKeyName,
                  condition: DictionaryConditions.EQUALS,
                  value: {
                    asString: orgId,
                  },
                },
              })),
            },
          } as unknown) as DictionarySubFilter);
        }
      } else {
        (result as DictionaryOptions).filterCodes = invite?.organizations.map((org) => org.orgId);
      }
    }
    return result;
  }

  getFilter(parentOrderId?: string, bookId?: string): Observable<Invite> {
    const cacheId = `${parentOrderId}${bookId}`;

    return of(cacheId).pipe(
      delayWhen(() => this.processStatus.pipe(filter((v) => !v[cacheId]))),
      concatMap((id) => {
        if (!this.screenService?.component?.attrs?.isInvite) {
          return of(({} as unknown) as Invite);
        }
        if (this.cache[id]) {
          return of(this.cache[id]);
        }
        const status = this.processStatus.getValue();
        status[id] = true;
        this.processStatus.next(status);

        return this.getInvite(
          parentOrderId ??
            this.route.snapshot.queryParamMap.get('parentOrderId') ??
            String(this.screenService.orderId),
          bookId,
        ).pipe(
          tap((invite) => {
            this.cache[id] = invite;
          }),
          catchError(() => of({})),
          finalize(() => {
            const processStatusValue = this.processStatus.getValue();
            delete processStatusValue[id];
            this.processStatus.next(processStatusValue);
          }),
        );
      }),
    );
  }

  getInvite(parentOrderId: string, bookId?: string): Observable<Invite> {
    let params = new HttpParams().append('parentOrderId', parentOrderId);
    if (bookId) {
      params = params.append('bookId', bookId);
    }

    return this.http.get<Invite>(this.path, { params, withCredentials: true });
  }
}
