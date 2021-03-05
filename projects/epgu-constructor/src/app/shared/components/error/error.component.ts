import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ErrorComponent {
  @Input() data: AbstractControl;
  @Input() disableError = false;
}
