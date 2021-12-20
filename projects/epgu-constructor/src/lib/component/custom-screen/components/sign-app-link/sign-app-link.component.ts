import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';

import { System } from '@epgu/epgu-constructor-types';
import { DeviceDetectorService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { AppLink, ErrorType } from './sign-app-link.types';
import SingAppLinkModelAttrs from './SingAppLinkModelAttrs';

@Component({
  selector: 'epgu-constructor-os-determinant',
  templateUrl: './sign-app-link.component.html',
  styleUrls: ['./sign-app-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class SignAppLinkComponent extends AbstractComponentListItemComponent<SingAppLinkModelAttrs>
  implements OnInit {
  public appLinks: AppLink[];
  private clientSystem: System;
  private clientAppLink: AppLink;

  constructor(public injector: Injector, private deviceDetectorService: DeviceDetectorService) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.appLinks = this.attrs?.appLinks;
    this.clientSystem = this.deviceDetectorService.system;

    switch (this.clientSystem) {
      case System.Desktop:
        break;
      case System.Error:
        this.emitToParentForm('error', ErrorType.userAgent);
        break;
      case System.NotDetermined:
        this.emitToParentForm('notDetermined');
        break;
      default:
        this.clientAppLink = this.appLinks.find((appLink) => appLink.type === this.clientSystem);
        if (this.clientAppLink) {
          this.emitToParentForm(this.clientAppLink);
          this.appLinks = [this.clientAppLink];
        } else {
          this.emitToParentForm('error', ErrorType.json);
        }
        break;
    }
  }

  private emitToParentForm(agent, error = ''): void {
    this.control.get('value').setValue({
      agent,
      error,
    });
    this.formService.emitChanges();
  }
}
