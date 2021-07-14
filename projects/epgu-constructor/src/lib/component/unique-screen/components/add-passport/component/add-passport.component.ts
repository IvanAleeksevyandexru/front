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
import { ComponentAttrsDto, DisplayDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { combineLatest } from 'rxjs';
import { Passport } from '../add-passport.models';
import { ISuggestionItem } from '../../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../../screen/screen.service';
import { SuggestHandlerService } from '../../../../../shared/services/suggest-handler/suggest-handler.service';

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
  passportForm: FormGroup;

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.screenService.display$])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([data]) => {
        this.createForm(data);
        this.subscribeToFormChanges();
      });
  }

  private createForm(data: DisplayDto): void {
    const initValue = JSON.parse(
      data.components.find((component) => component.type === 'PassportLookup').value || '{}',
    );
    this.passportForm = new FormGroup({
      passport: new FormControl(initValue, Validators.required),
    });
  }

  private subscribeToFormChanges(): void {
    this.passportForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), startWith([null]))
      .subscribe((value) => {
        this.onChangeForm({
          value: value?.passport,
          isValid: this.passportForm.valid,
        });
      });
  }

  private onChangeForm({ isValid, value }: Passport): void {
    this.changeFormEvent.emit({
      value,
      isValid,
    });
  }
}
