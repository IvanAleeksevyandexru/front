import { Injectable } from '@angular/core';
import { DisplayInterface, ResponseInterface } from '../../../interfaces/epgu.service.interface';


@Injectable()
export class ConstructorServiceStub {
  response: ResponseInterface;
  componentId: string;
  componentType: string;
  componentData: DisplayInterface;
  isLoading = false;

  getData(): void {}

  nextStep(): void {}

  prevStep(): void {}

  updateRequest(): void {}

  sendDataSuccess(): void {}

  sendDataError(): void {}

  initResponse(): void {}
}
