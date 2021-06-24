import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-notary-info',
  templateUrl: './notary-info.component.html',
  styleUrls: ['./notary-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotaryInfoComponent {
  @Input() showSellWarning = false;
  @Input() isPledged: boolean;
}
