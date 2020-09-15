import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../config/config.service';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../unsubscribe/unsubscribe.service';

@Injectable()
export class DadataApiService {
  externalApiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private ngUnsubscribe$: UnsubscribeService
  ) {
    this.configService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(config => {
      this.externalApiUrl = config.externalApiUrl;
    });
  }

  getDadataByFias(fiasCode: string) {
    const path = `${this.externalApiUrl}/dadata/${fiasCode}`;
    return this.http.get(path);
  }
}
