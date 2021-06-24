import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class AppRoutingServiceStub {

  public component$ = of({});

  public initRouting(): void {}
}
