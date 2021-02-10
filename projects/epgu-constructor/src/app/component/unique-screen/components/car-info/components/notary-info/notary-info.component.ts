import { Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-notary-info',
  templateUrl: './notary-info.component.html',
  styleUrls: ['./notary-info.component.scss'],
})
export class NotaryInfoComponent {
  @Input() isPledged: boolean;
}
