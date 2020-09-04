import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { ConfigService } from '../../../../../../../../config/config.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
  providers: [UnsubscribeService],
})
export class TemporaryRegistrationAddrComponent implements OnChanges {
  forms: any = {};
  @ViewChild('dataForm', { static: false }) dataForm: NgForm;
  @Input() data: TemporaryRegistrationAddrComponentInterface;
  @Input() error: string;

  constructor(
    public configService: ConfigService,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      setTimeout(() => {
        this.subscribeToFormChanges();
      });
    }
  }

  hintClick(timestamp: number) {
    const currentDayTimestamp = new Date().getTime();
    this.forms.regDate = new Date(currentDayTimestamp + timestamp);
  }

  private formChanges(changesData) {
    this.componentStateService.state = changesData;
  }

  private subscribeToFormChanges() {
    this.dataForm.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((dt) => this.formChanges(dt));
  }
}
