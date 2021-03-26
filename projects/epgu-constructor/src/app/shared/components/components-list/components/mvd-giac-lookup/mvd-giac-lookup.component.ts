import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomListDropDowns } from '../../components-list.types';
import { DictionaryToolsService } from '../../../../services/dictionary/dictionary-tools.service';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-mvd-giac-lookup',
  templateUrl: './mvd-giac-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MvdGiacLookupComponent implements OnInit {
  @Input() componentIndex = 0;

  control: FormGroup | AbstractControl = this.formService.form.controls[this.componentIndex];
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;
  queryMinSymbolsCount = 0;
  searchCaseSensitive = false;
  virtualScroll = true;
  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.dictionaryToolsService.dropDowns$;

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    public formService: ComponentsListFormService,
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
