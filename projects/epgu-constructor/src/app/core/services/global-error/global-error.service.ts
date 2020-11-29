import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { HealthService } from 'epgu-lib';

interface Error {
  message: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private health: HealthService) {}

  handleError(error: Error): void {
    if (!(error instanceof HttpErrorResponse)) {
        this.health.measureStart('clientError');
        this.health.measureEnd('clientError', 1, { 
            errorMessage: error.message ? error.message : error.toString() 
        });
        console.error(error);
    }
  }
}