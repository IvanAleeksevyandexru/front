import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomScreenComponentTypes } from '../../components-list.types';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-form-output-html',
  templateUrl: './form-output-html.component.html',
  styleUrls: ['form-output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FormOutputHtmlComponent implements OnInit {
  @Input() componentIndex = 0;

  control: FormGroup | AbstractControl = this.formService.form.controls[this.componentIndex];
  outputHtmlClass: Partial<Record<CustomScreenComponentTypes, string>> = {
    [CustomScreenComponentTypes.LabelSection]: 'label',
    [CustomScreenComponentTypes.HtmlString]: 'info__text',
  };

  constructor(
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
