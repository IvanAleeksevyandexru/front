import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {EgpuResponseDisplayInterface} from '../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-add-passport-screen',
  templateUrl: './add-passport-screen.component.html',
  styleUrls: ['./add-passport-screen.component.scss'],
})
export class AddPassportScreenComponent implements OnInit {
  @Input() data: EgpuResponseDisplayInterface;
  @Input() header: string;
  @Input() submitLabel: string;
  @Output() nextStepEvent = new EventEmitter();

  passportForm: FormGroup;

  constructor(private fb: FormBuilder) {}

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
