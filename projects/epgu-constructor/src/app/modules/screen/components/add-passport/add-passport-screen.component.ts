import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-passport-screen',
  templateUrl: './add-passport-screen.component.html',
  styleUrls: ['./add-passport-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportScreenComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<any> = new Subject<any>();

  @Input() data: any;
  @Input() header: string;
  @Input() submitLabel: string;
  @Output() valueChangedEvent = new EventEmitter();

  passportForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const controls = {};

    this.data.attrs.fields.forEach((field) => {
      controls[field.fieldName] = this.fb.control(null, [Validators.required]);
    });

    this.passportForm = this.fb.group(controls);
    this.passportForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(300))
      .subscribe((value) => {
        if (!this.passportForm.valid) {
          return;
        }

        this.valueChangedEvent.emit(value);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
