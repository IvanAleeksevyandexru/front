import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationLinkInterface } from '../../models/application.interface';

@Component({
  selector: 'epgu-constructor-signature-application-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  @Input() links: ApplicationLinkInterface;
  @Input() isVisibility: boolean;
  @Output() changeVisibilityEvent = new EventEmitter<boolean>();

  changeVisibility(isVisibility: boolean) {
    this.changeVisibilityEvent.emit(isVisibility);
  }
}
