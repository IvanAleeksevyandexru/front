import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-masked-and-plain-input',
  templateUrl: './masked-and-plain-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MaskedAndPlainInputComponent extends AbstractComponentListItemComponent {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => suggestions[this.control.value?.id]),
  );
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
