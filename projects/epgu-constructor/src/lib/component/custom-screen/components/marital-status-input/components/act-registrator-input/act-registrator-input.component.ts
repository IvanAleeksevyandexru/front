import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListElement, LookupProvider } from '@epgu/ui/models/dropdown';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { ISuggestionItem } from '../../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { MaritalStatusInputFieldsTypes } from '../../marital-status-input.types';

@Component({
  selector: 'epgu-constructor-act-registrator-input',
  templateUrl: './act-registrator-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActRegistratorInputComponent {
  @Input() label: string;
  @Input() attrs: ComponentAttrsDto;
  @Input() hint?: string;
  @Input() control: AbstractControl;
  @Input() validationShowOn: ValidationShowOn;
  @Input() itemsProvider: LookupProvider<Partial<ListElement>>;

  public provider;
  public searchIconForcedShowing = false;
  public showNotFound;
  public FieldsTypes = MaritalStatusInputFieldsTypes;

  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    private screenService: ScreenService,
    public cdr: ChangeDetectorRef,
  ) {}

  public markControlAsDirty(): void {
    this.control.markAsDirty();
    this.control.updateValueAndValidity();
  }
}
