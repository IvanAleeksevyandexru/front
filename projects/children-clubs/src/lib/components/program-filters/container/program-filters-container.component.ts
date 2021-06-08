import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormValue } from '../program-filters.models';

// Контейнер скорее всего не понадобится так как компонент будет использваться в нескольких местах как простая форма
@Component({
  selector: 'children-clubs-program-filters-container',
  templateUrl: './program-filters-container.component.html',
  styleUrls: ['./program-filters-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramFiltersContainerComponent {
  submit(formValue: FormValue): void {
    console.log('submit container');
  }
}
