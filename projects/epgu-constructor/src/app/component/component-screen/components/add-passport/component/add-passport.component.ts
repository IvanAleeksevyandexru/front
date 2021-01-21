import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { ComponentAttrsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { Passport } from '../add-passport.models';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportComponent implements OnInit {
  @Input() attrs: ComponentAttrsDto;
  @Output() changeFormEvent = new EventEmitter<Passport>();
  form: FormGroup;

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.createForm();

    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), startWith([null]))
      .subscribe((value) => {
        this.onChangeForm({
          value: value?.passport,
          isValid: this.form.valid,
        });
      });
  }

  private createForm(): void {
    this.form = new FormGroup({
      passport: new FormControl(null, Validators.required),
    });
  }

  private onChangeForm({ isValid, value }: Passport): void {
    this.changeFormEvent.emit({
      value,
      isValid,
    });
  }
}