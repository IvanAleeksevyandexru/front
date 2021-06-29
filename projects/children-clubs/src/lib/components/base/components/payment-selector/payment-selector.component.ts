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
import { EventBusService, ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

// eslint-disable-next-line import/no-extraneous-dependencies
import { takeUntil } from 'rxjs/operators';
import { InlernoPaymentFilters, PfdoPaymentFilters, VendorType } from '../../../../typings';
import { StateService } from '../../../../services/state/state.service';
import {
  aboutPayment,
  defaultInlearnoFilters,
  defaultPdfoFilters,
  FormFieldsLabel,
  FormFieldsName,
} from '../../base.models';
import { ContentModalComponent } from '../content-modal/content-modal.component';

@Component({
  selector: 'children-clubs-payment-selector',
  templateUrl: './payment-selector.component.html',
  styleUrls: ['./payment-selector.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PaymentSelectorComponent implements OnInit {
  @Input() initValue: PfdoPaymentFilters | InlernoPaymentFilters;
  @Output() changes = new EventEmitter<PfdoPaymentFilters | InlernoPaymentFilters>();

  aboutPayment = aboutPayment;
  vendor = this.stateService.vendor;
  formFields = FormFieldsName;
  formFieldsLabel = FormFieldsLabel;
  vendorType = VendorType;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
    private modalService: ModalService,
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
      .on('RESET_FILTER')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.reset());
  }

  openAboutPayment(): void {
    this.modalService
      .openModal(ContentModalComponent, { ...aboutPayment, modalId: 'aboutPayment' })
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
