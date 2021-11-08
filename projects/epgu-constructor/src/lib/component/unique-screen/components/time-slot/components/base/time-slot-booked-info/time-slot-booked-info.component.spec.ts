import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { TimeSlotBookedInfoComponent } from './time-slot-booked-info.component';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';
import { ConfigService, ConfigServiceStub, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../../../../shared/base.module';
import { of } from 'rxjs';
import { Slot } from '../../../typings';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

const mockSlot = {
  slotId: 'e3758564-bf72-4bc3-be55-b6c4e31954275456',
  slotTime: new Date('2021-09-14T10:00:00.000'),
  timezone: '+03:00',
  areaId: 'Дом музыки',
} as Slot;

describe('TimeSlotBookedInfoComponent', () => {
  let component: TimeSlotBookedInfoComponent;
  let fixture: ComponentFixture<TimeSlotBookedInfoComponent>;
  let smev3: TimeSlotSmev3Service;
  let dateService: DatesToolsService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSlotBookedInfoComponent],
      imports: [BaseModule, HttpClientTestingModule],
      providers: [
        { provide: TimeSlotSmev3Service, useClass: TimeSlotSmev3ServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        DatesToolsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    dateService = TestBed.inject(DatesToolsService);
    jest.spyOn(dateService, 'utcOffset').mockReturnValue(mockSlot.slotTime);
    smev3 = TestBed.inject(TimeSlotSmev3Service);
    smev3.bookedSlot$ = of(mockSlot);
    fixture = TestBed.createComponent(TimeSlotBookedInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('base', () => {
    it('should be render', () => {
      expect(
        fixture.debugElement.query(By.css('.time--bold'))?.nativeElement?.innerHTML?.trim(),
      ).toBe('14 сентября 2021 года в 10:00, вторник');
    });
  });
});
