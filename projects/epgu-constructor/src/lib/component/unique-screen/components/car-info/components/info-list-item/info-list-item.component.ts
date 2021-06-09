import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-info-list-item',
  templateUrl: './info-list-item.component.html',
  styleUrls: ['./info-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoListItemComponent {
  @Input() value: string;
  @Input() label: string;
}
