import { Injectable } from '@angular/core';

@Injectable()
export class ComponentStateService {

  // <-- component
  state: any;
  isValid: boolean;

  constructor() { }
}
