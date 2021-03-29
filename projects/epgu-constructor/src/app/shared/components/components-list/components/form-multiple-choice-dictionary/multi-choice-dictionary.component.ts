import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemDirective } from '../abstract-component-list-item/abstract-component-list-item.directive';

@Component({
  selector: 'epgu-constructor-multi-choice-dictionary',
  templateUrl: './multi-choice-dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MultiChoiceDictionaryComponent extends AbstractComponentListItemDirective {
  constructor(public injector: Injector) {
    super(injector);
  }
}
