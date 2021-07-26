import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'example-1-epgu-checkbox-component',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example1EpguCheckboxComponent {
  readonly checkboxId = 'id1';
  readonly labelText = 'Сопроводительный текст-лейбл';
  readonly control = new FormControl();
  readonly isLoading = false;
  readonly required = true;
  readonly hidden = false;

  handleClick(event): void {
    if (event.target.id) {
      console.log(`${event.target.id}, ${event.target.checked}`);
    }
  }
}
