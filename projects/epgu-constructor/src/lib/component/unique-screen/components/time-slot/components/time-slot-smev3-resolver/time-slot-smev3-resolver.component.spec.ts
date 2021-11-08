import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimeSlotSmev3ResolverComponent } from './time-slot-smev3-resolver.component';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { TimeSlotSmev3StateService } from '../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../services/smev3-state/time-slot-smev3-state.service.stub';
import { TimeSlotsTypes } from '../../time-slot.const';
import { TimeSlotVaccinationComponent } from '../component-types/time-slot-vaccination/time-slot-vaccination.component';
import { MockComponent } from 'ng-mocks';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TimeSlotDivorceComponent } from '../component-types/time-slot-divorce/time-slot-divorce.component';
import { TimeSlotMarriageComponent } from '../component-types/time-slot-marriage/time-slot-marriage.component';
import { TimeSlotDoctorComponent } from '../component-types/time-slot-doctor/time-slot-doctor.component';
import { TimeSlotGibddComponent } from '../component-types/time-slot-gibdd/time-slot-gibdd.component';
import { TimeSlotMvdComponent } from '../component-types/time-slot-mvd/time-slot-mvd.component';
import { TimeSlotSmev3Component } from '../base/time-slot-smev3/time-slot-smev3.component';
import { of } from 'rxjs';
import { TimeSlotErrorServiceStub } from '../../services/error/time-slot-error.service.stub';
import { TimeSlotErrorService } from '../../services/error/time-slot-error.service';

describe('TimeSlotSmev3ResolverComponent', () => {
  let component: TimeSlotSmev3ResolverComponent;
  let fixture: ComponentFixture<TimeSlotSmev3ResolverComponent>;
  let smev3Service: TimeSlotSmev3StateService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TimeSlotSmev3ResolverComponent,
        TimeSlotVaccinationComponent,
        MockComponent(TimeSlotSmev3Component),
      ],
      imports: [],
      providers: [
        UnsubscribeService,
        { provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub },
        { provide: TimeSlotErrorService, useClass: TimeSlotErrorServiceStub },
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TimeSlotVaccinationComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    smev3Service = TestBed.inject(TimeSlotSmev3StateService);
    smev3Service.type$ = of(TimeSlotsTypes.VACCINATION);
    fixture = TestBed.createComponent(TimeSlotSmev3ResolverComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be handleComponentError', () => {
      expect(() => component['handleComponentError'](TimeSlotsTypes.VACCINATION)).toThrow(
        new Error('[TimeSlot] We cant find component for this component type: VACCINATION}'),
      );
    });
    it('should be createComponent', () => {
      fixture.detectChanges();
      component['createComponent'](TimeSlotsTypes.VACCINATION);
      expect(component.componentRef).not.toBeNull();
    });
    it('should be destroyComponent', () => {
      fixture.detectChanges();
      component['createComponent'](TimeSlotsTypes.VACCINATION);
      expect(component.componentRef).not.toBeNull();
      component['destroyComponent']();
      expect(component.componentRef).toBeNull();
    });
    it('should be getComponentByType', () => {
      expect(component['getComponentByType'](TimeSlotsTypes.VACCINATION)).toBe(
        TimeSlotVaccinationComponent,
      );
    });
  });
});
