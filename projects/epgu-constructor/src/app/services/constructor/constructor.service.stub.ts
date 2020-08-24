import {Injectable} from '@angular/core';
import {EgpuResponseDisplayInterface, EgpuResponseInterface} from '../../../interfaces/epgu.service.interface';


@Injectable()
export class ConstructorServiceStub {
  response: EgpuResponseInterface;
  componentId: string;
  componentType: string;
  componentData: EgpuResponseDisplayInterface;
  isLoading = false;

  getData(): void {}

  nextStep(): void {}

  prevStep(): void {}

  updateRequest(): void {}

  sendDataSuccess(): void {}

  sendDataError(): void {}

  initResponse(): void {}
}
