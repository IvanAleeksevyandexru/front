import { Component, OnInit, Output, EventEmitter } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'epgu-lib';
import { checkSnils } from 'ru-validation-codes';
import { takeUntil } from 'rxjs/operators';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-snils',
  templateUrl: './snils.component.html',
  styleUrls: ['./snils.component.scss'],
})
export class SnilsComponent implements OnInit {
  @Output() valueChangedEvent = new EventEmitter<any>();

  public mask = this.validationService.masks.snils;
  public snils = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    // eslint-disable-next-line
    this.checkSnilsSum,
  ]);
  constructor(
    private validationService: ValidationService,
    private screenComponentService: ScreenComponentService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.subscribeToSnilsValue();
  }

  checkSnilsSum(control: FormControl): { [s: string]: boolean } {
    if (!checkSnils(control.value)) {
      return { notValid: true };
    }
    return null;
  }

  private subscribeToSnilsValue(): void {
    this.snils.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => this.valueChangedEvent.emit(value));
  }
}
