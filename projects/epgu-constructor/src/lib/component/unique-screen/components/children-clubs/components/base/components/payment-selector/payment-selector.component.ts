import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  BusEventType,
  EventBusService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import {
  PfdoPaymentFilters,
  InlernoPaymentFilters,
  VendorType,
} from '../../../../models/children-clubs.types';
import {
  aboutPayment,
  defaultInlearnoFilters,
  defaultPdfoFilters,
  FormFieldsLabel,
  FormFieldsName,
} from '../../base.models';
import { ConfirmationModalComponent } from '../../../../../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-cc-payment-selector',
  templateUrl: './payment-selector.component.html',
  styleUrls: ['../../../../../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PaymentSelectorComponent implements OnInit {
  @Input() initValue: PfdoPaymentFilters | InlernoPaymentFilters;
  @Output() changes = new EventEmitter<PfdoPaymentFilters | InlernoPaymentFilters>();

  aboutPayment = aboutPayment;
  vendor: VendorType = this.screenService.component?.arguments?.vendor as VendorType;
  formFields = FormFieldsName;
  formFieldsLabel = FormFieldsLabel;
  vendorType = VendorType;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private modalService: ModalService,
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.form =
      this.vendor === VendorType.pfdo
        ? this.createPfdoPaymentsGroup(this.initValue as PfdoPaymentFilters)
        : this.createInlernoPaymentsGroup(this.initValue as InlernoPaymentFilters);
    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => this.changes.emit(value));
    this.eventBusService
      .on(BusEventType.ResetFilter)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.reset());
  }

  openAboutPayment(): void {
    this.modalService
      .openModal(ConfirmationModalComponent, {
        ...aboutPayment,
        text: 'aboutPayment',
        subModal: true,
      })
      .subscribe();
  }

  private createInlernoPaymentsGroup(inlernoPayments?: InlernoPaymentFilters): FormGroup {
    return this.fb.group({
      [this.formFields.free]: new FormControl(inlernoPayments?.free || false),
      [this.formFields.certificate]: new FormControl(inlernoPayments?.certificate || false),
      [this.formFields.personalFunds]: new FormControl(inlernoPayments?.personalFunds || false),
    });
  }

  private createPfdoPaymentsGroup(payments?: PfdoPaymentFilters): FormGroup {
    return this.fb.group({
      [this.formFields.valued]: new FormControl(payments?.valued || false),
      [this.formFields.preprof]: new FormControl(payments?.preprof || false),
      [this.formFields.other]: new FormControl(payments?.other || false),
      [this.formFields.certificate]: new FormControl(payments?.certificate || false),
      [this.formFields.personalFunds]: new FormControl(payments?.personalFunds || false),
    });
  }

  private reset(): void {
    this.form.reset(this.vendor === VendorType.pfdo ? defaultPdfoFilters : defaultInlearnoFilters);
  }
}
