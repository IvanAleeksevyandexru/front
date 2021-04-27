import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-expansion-link',
  templateUrl: './expansion-link.component.html',
  styleUrls: ['./expansion-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionLinkComponent {
  @Input() isExpanded = false;
  @Input() openDescription = 'Показать детали';
}
