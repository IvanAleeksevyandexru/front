import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ComponentAttrsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { Passport } from '../add-passport.models';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../../screen/screen.service';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportComponent implements OnInit {
  @Input() attrs: ComponentAttrsDto;
  @Output() changeFormEvent = new EventEmitter<Passport>();
  suggestions$: Observable<{ [key: string]: ISuggestionItem }> = this.screenService.suggestions$;
  componentId$ = this.screenService.component$.pipe(map(({ id }) => id));
  form: FormGroup;

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
    private eventBusService: EventBusService,
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), startWith([null]))
      .subscribe((value) => {
        this.onChangeForm({
          value: value?.passport,
          isValid: this.form.valid,
        });
      });
  }

  public suggestHandle(event: ISuggestionItem | ISuggestionItemList): void {
    // NOTICE: необходимо различать два ивента: клик по ссылке "Есть неактуальные данные?" (передается с доп.атрибутом `isEdit`)
    // и обычный выбор опции из списка саджестов, соответственно, вызывать модалку для удаления неактуальных саджестов или
    // запускать механизм подстановки выбранного значения в инпут.
    if (Object.prototype.hasOwnProperty.call(event, 'isEdit')) {
      this.eventBusService.emit('suggestionsEditEvent', event as ISuggestionItem);
    } else {
      this.eventBusService.emit('suggestionSelectedEvent', {
        ...event,
      } as ISuggestionItemList);
    }
  }

  private createForm(): void {
    this.form = new FormGroup({
      passport: new FormControl(null, Validators.required),
    });
  }

  private onChangeForm({ isValid, value }: Passport): void {
    this.changeFormEvent.emit({
      value,
      isValid,
    });
  }
}
