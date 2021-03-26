import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-multi-choice-dictionary',
  templateUrl: './multi-choice-dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MultiChoiceDictionaryComponent {
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
