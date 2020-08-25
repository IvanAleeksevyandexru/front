import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstructorConfigService} from '../../../../services/config/constructor-config.service';

@Injectable()
export class TimeSlotsService {

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
  ) {

  }

  public bookTimeSlot(requestBody) {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/book?srcSystem=BETA`;
    return this.http.post(path, requestBody);
  }
}
