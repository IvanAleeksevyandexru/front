import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ISuggestionItem } from '../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemDirective } from '../abstract-component-list-item/abstract-component-list-item.directive';

@Component({
  selector: 'epgu-constructor-masked-and-plain-input',
  templateUrl: './masked-and-plain-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MaskedAndPlainInputComponent extends AbstractComponentListItemDirective {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.NONE;

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
