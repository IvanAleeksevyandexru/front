import { of } from 'rxjs';

export class LoadServiceStub {
  public config = {
    staticDomain: ''
  };
  public attributes = {
    deviceType: 'dev'
  };
  public loaded = of(true);
}
