import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService, BusEventType, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { of } from 'rxjs';
import { ForTestsOnlyModule } from '../../../../../../../../core/for-tests-only.module';
import { ConfirmationModalComponent } from '../../../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { VendorType } from '../../../../models/children-clubs.types';
import { aboutPayment, defaultInlearnoFilters, defaultPdfoFilters } from '../../base.models';
import { PaymentSelectorComponent } from './payment-selector.component';

describe('ViewComponent', () => {
  let component: PaymentSelectorComponent;
  let fixture: ComponentFixture<PaymentSelectorComponent>;
  let eventBusService: EventBusService;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForTestsOnlyModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSelectorComponent);
    component = fixture.componentInstance;
    eventBusService = TestBed.inject(EventBusService);
    modalService = TestBed.inject(ModalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createPaymentsGroup on ngOnInit', () => {
    const spy1 = jest.spyOn<any, any>(component, 'createInlernoPaymentsGroup');
    const spy2 = jest.spyOn<any, any>(component, 'createPfdoPaymentsGroup');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    component.vendor = VendorType.pfdo;
    component.ngOnInit();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call reset on BusEventType.ResetFilter', () => {
    const spy = jest.spyOn<any, any>(component, 'reset');
    component.ngOnInit();
    eventBusService.emit(BusEventType.ResetFilter);
    expect(spy).toHaveBeenCalled();
  });

  it('reset should call form.reset with params', () => {
    component.ngOnInit();
    const spy = jest.spyOn<any, any>(component.form, 'reset');
    component['reset']();
    expect(spy).toHaveBeenCalledWith(defaultInlearnoFilters);
    component.vendor = VendorType.pfdo;
    component['reset']();
    expect(spy).toHaveBeenCalledWith(defaultPdfoFilters);
  });

  it('openAboutPayment should call modalService.openModal with params', () => {
    const spy = jest.spyOn(modalService, 'openModal').mockReturnValueOnce(of(''));
    component.openAboutPayment();
    expect(spy).toHaveBeenLastCalledWith(ConfirmationModalComponent, {
      ...aboutPayment,
      text: 'aboutPayment',
      subModal: true,
    });
  });
});
