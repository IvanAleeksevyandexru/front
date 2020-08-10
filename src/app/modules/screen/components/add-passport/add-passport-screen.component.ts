import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-add-passport-screen',
  templateUrl: './add-passport-screen.component.html',
  styleUrls: ['./add-passport-screen.component.scss'],
})
export class AddPassportScreenComponent implements OnInit {
  @Input() data: EgpuResponseDisplayInterface;
  @Input() header: string;
  @Input() submitLabel: string;
  @Output() valueChangedEvent = new EventEmitter();

  passportForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.passportForm = this.fb.group({
      series: this.fb.control(null, Validators.required),
      number: this.fb.control(null, Validators.required),
    });

    this.passportForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      if (!this.passportForm.valid) {
        return;
      }

      this.valueChangedEvent.emit(value);
    });
  }
}
