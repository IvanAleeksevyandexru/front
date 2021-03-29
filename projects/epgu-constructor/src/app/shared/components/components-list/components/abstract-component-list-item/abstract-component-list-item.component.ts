import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';

@Component({
  template: '',
})
export class AbstractComponentListItemComponent implements OnInit {
  @Input() componentIndex;
  @Input() componentsGroupIndex;

  public formService: ComponentsListFormService;
  public control: FormGroup | AbstractControl;
  public ngUnsubscribe$: UnsubscribeService;
  public cdr: ChangeDetectorRef;

  constructor(public injector: Injector) {
    this.formService = this.injector.get(ComponentsListFormService);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.cdr = this.injector.get(ChangeDetectorRef);
  }

  ngOnInit(): void {
    this.control = this.formService.form.controls[this.componentIndex];
    merge(this.control.statusChanges, this.control.valueChanges)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }
}
