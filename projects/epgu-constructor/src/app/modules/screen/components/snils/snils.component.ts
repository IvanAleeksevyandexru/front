import { Component, OnInit, Input } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'epgu-lib';
import { checkSnils } from 'ru-validation-codes';
import { takeUntil } from 'rxjs/operators';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-snils',
  templateUrl: './snils.component.html',
  styleUrls: ['./snils.component.scss'],
})
export class SnilsComponent implements OnInit {
  @Input() data: ComponentInterface;
  public mask = this.validationService.masks.snils;
  public snils = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    // eslint-disable-next-line
    this.checkSnilsSum,
  ]);
  constructor(
    private validationService: ValidationService,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.saveSnils();
  }
  checkSnilsSum(control: FormControl): { [s: string]: boolean } {
    if (!checkSnils(control.value)) {
      return { notValid: true };
    }
    return null;
  }
  saveSnils() {
    this.snils.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((value) => {
      if (this.snils.valid) {
        this.componentStateService.state = value.replace(/\D/g, '');
      }
    });
  }
}
