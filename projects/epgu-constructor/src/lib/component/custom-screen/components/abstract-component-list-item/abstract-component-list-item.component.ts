import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import BaseModel from '../../component-list-resolver/BaseModel';

@Component({
  template: '',
})
export class AbstractComponentListItemComponent<T> implements OnInit {
  @Input() componentIndex: number;
  @Input() componentsGroupIndex: number;
  @Input() limit?: number | string;

  public formService: ComponentsListFormService;
  public control: AbstractControl;
  public ngUnsubscribe$: UnsubscribeService;
  public cdr: ChangeDetectorRef;

  constructor(public injector: Injector) {
    this.formService = this.injector.get(ComponentsListFormService);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.cdr = this.injector.get(ChangeDetectorRef);
  }

  get attrs(): T {
    return this.control?.value?.attrs;
  }

  get model(): BaseModel<GenericAttrs> {
    return this.control?.value?.model;
  }

  ngOnInit(): void {
    this.control = this.formService.form.controls[this.componentIndex];

    // @todo. Приходится запускать markForCheck() при изменениях формы, а не только текущего контрола, т.к.
    // изменение зависимых контролов происходит с emitEvent: false. Нужно придумать лучшее решение
    // http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/merge_requests/1758
    merge(this.formService.form.statusChanges, this.formService.form.valueChanges)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }
}
