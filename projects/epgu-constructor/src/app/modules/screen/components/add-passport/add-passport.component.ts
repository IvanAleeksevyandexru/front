import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';

@Component({
  selector: 'app-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<any> = new Subject<any>();

  @Input() data: any;
  @Input() header: string;
  @Input() submitLabel: string;

  passportForm: FormGroup;

  constructor(private fb: FormBuilder, private screenComponentService: ScreenComponentService) {}

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

        this.screenComponentService.dataToSend = value;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
