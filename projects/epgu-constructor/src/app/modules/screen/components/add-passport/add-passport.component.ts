import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormBuilder, FormGroup } from '@angular/forms';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';

@Component({
  selector: 'app-add-passport-screen',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
})
export class AddPassportComponent implements OnInit {
  @Input() data: EgpuResponseDisplayInterface;
  @Input() header: string;
  @Input() submitLabel: string;
  @Output() nextStepEvent = new EventEmitter();

  passportForm: FormGroup;

  constructor(private fb: FormBuilder, private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    this.passportForm = this.fb.group({
      series: this.fb.control({}),
      number: this.fb.control({}),
    });
  }

  nextStep() {
    if (!this.passportForm.valid) {
      return;
    }

    this.nextStepEvent.emit(this.passportForm.value);
  }
}
