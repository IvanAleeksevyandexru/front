import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-passport-lookup',
  templateUrl: './passport-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PassportLookupComponent extends AbstractComponentListItemComponent {
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
