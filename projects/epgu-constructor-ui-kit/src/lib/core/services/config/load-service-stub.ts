import { BehaviorSubject } from 'rxjs';

export class LoadServiceStub {
  public config = {
    staticDomain: '',
  };
  public attributes = {
    deviceType: 'dev',
  };
  public loaded = new BehaviorSubject(false);
}
