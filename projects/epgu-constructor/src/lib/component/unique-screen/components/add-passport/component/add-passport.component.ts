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
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
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
  form: FormGroup;

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
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
