import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CertificateEaisdoService {
  private _showButtons = new BehaviorSubject(true);

  get showButtons$(): Observable<boolean> {
    return this._showButtons.asObservable();
  }

  get showButtons(): boolean {
    return this._showButtons.getValue();
  }

  set showButtons(value: boolean) {
    this._showButtons.next(value);
  }
}
