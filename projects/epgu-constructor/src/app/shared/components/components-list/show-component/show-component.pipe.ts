import { Pipe, PipeTransform } from '@angular/core';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ComponentsListFormService } from '../../../services/components-list-form/components-list-form.service';

@Pipe({
  name: 'showComponent',
})
export class ShowComponentPipe implements PipeTransform {

  constructor (public formService: ComponentsListFormService) {}

  transform(component: ComponentDto): boolean {
    return this.formService.shownElements[component.id]?.isShown && !component.attrs?.hidden;
  }
}
