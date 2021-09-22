import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ComponentDto } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-photo-description',
  templateUrl: './photo-description.component.html',
  styleUrls: ['./photo-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDescriptionComponent {
  @Input() data: ComponentDto;
}
