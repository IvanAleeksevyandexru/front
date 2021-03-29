import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ISuggestionItem } from '../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemDirective } from '../abstract-component-list-item/abstract-component-list-item.directive';

@Component({
  selector: 'epgu-constructor-passport-lookup',
  templateUrl: './passport-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PassportLookupComponent extends AbstractComponentListItemDirective {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
