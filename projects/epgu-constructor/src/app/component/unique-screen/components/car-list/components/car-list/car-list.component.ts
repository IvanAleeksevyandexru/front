import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ListItem } from 'epgu-lib';
import { VehicleOwnerInfo } from '../../models/car-list.interface';
import { ClarificationsDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarListComponent {
  @Input() clarifications: ClarificationsDto;
  @Input() staticDomainAssetsPath: string;
  @Input() searchCaseSensitive: boolean;
  @Input() provider: { search: (searchString: string) => Observable<Partial<ListItem>[]> };
  @Input() formatter: (item: ListItem) => string;
  @Input() label: string;
  @Input() carFixedItems: Partial<ListItem>[];
  @Input() control: FormControl;

  @Output() formChangeEvent = new EventEmitter<VehicleOwnerInfo>();

  lookupChanged(): void {
    this.formChangeEvent.emit(<VehicleOwnerInfo>this.control.value.originalItem);
  }
}
