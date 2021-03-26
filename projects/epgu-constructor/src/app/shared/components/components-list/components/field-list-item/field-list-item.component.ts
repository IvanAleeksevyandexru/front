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
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';

@Component({
  selector: 'epgu-constructor-field-list-item',
  templateUrl: './field-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FieldListItemComponent implements OnInit {
  @Input() componentIndex = 0;

  control: FormGroup | AbstractControl = this.formService.form.controls[this.componentIndex];

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
