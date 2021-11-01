import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import KinderGartenDraftHandlerModelAttrs from './KinderGartenDraftHandlerModelAttrs';

@Component({
  selector: 'epgu-constructor-kinder-garten-draft-handler',
  templateUrl: './kinder-garten-draft-handler.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KinderGartenDraftHandlerComponent
  extends AbstractComponentListItemComponent<KinderGartenDraftHandlerModelAttrs>
  implements OnInit {
  constructor(public injector: Injector, private navigationService: NavigationService) {
    super(injector);
  }

  ngOnInit(): void {
    this.navigationService.next();
  }
}
