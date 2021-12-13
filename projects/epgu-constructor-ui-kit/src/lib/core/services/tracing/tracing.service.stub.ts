import { Injectable } from '@angular/core';

@Injectable()
export class TracingServiceStub {
  public init(): void {}

  public isAllowedRemoteServices(): boolean {
    return true;
  }

  public get tracer(): unknown {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public set serviceCode(_: string) {}
}
