import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ISuggestionItem } from '../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../services/suggest-handler/suggest-handler.service';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-passport-lookup',
  templateUrl: './passport-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PassportLookupComponent implements OnInit {
  @Input() componentIndex = 0;
  @Input() componentsGroupIndex = 0;

  control: FormGroup | AbstractControl = this.formService.form.controls[this.componentIndex];
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    public formService: ComponentsListFormService,
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    merge(this.control.statusChanges, this.control.valueChanges)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }
}
