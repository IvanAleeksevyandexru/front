import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-cc-deny-reason-title',
  templateUrl: './deny-reason-title.component.html',
  styleUrls: ['./deny-reason-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DenyReasonTitleComponent {
  @Input() title: string;
}
