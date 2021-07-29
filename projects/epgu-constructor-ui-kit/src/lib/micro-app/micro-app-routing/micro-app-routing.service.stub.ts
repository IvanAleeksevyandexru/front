import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MicroAppRoutingServiceStub {

  public component$ = of({});

  public initRouting(): void {}
}
