import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import KinderGartenDraftHandlerModelAttrs from './KinderGartenDraftHandlerModelAttrs';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-kinder-garten-draft-handler',
  templateUrl: './kinder-garten-draft-handler.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KinderGartenDraftHandlerComponent
  extends AbstractComponentListItemComponent<KinderGartenDraftHandlerModelAttrs>
  implements OnInit {
  constructor(
    public injector: Injector,
    private navigationService: NavigationService,
    private screenService: ScreenService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const payload = this.screenService.display.components.reduce(
      (acc, component) => ({
        ...acc,
        [component.id]: {
          visited: true,
          value: component.value,
        },
      }),
      {},
    );

    this.navigationService.next({ payload });
  }
}
