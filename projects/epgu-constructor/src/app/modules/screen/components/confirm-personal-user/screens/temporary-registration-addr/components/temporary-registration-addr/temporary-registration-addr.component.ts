import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
import { ScreenComponentService } from '../../../../../../service/screen-component/screen-component.service';
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

  constructor(
    public constructorConfigService: ConstructorConfigService,
    private screenComponentService: ScreenComponentService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.screenComponentService.dataToSend = '';
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
    this.screenComponentService.dataToSend = changesData;
  }

  private subscribeToFormChanges() {
    this.dataForm.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((dt) => this.formChanges(dt));
  }
}
