import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LocationService } from '../../../core/services/location/location.service';

/**
 * Модуль для редиректа на нужный адрес
 */
@Component({
  selector: 'epgu-constructor-redirect',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectComponent {
  constructor(private locationService: LocationService) {}

  @Input() set link(link: string) {
    this.locationService.href(link);
  }
}
