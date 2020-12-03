import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { interval } from 'rxjs';

import { ConfirmEmailComponent } from './confirm-email.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ConfigService } from '../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../core/config/config.service.stub';
import { CoreModule } from '../../../../../core/core.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let navigationModalService: NavigationModalService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      imports: [CoreModule, SharedModule, RouterTestingModule],
      providers: [
        UnsubscribeService,
        NavigationService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();

    navigationModalService = TestBed.inject(NavigationModalService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(NavigationService);
  });

  it('should be call this.navModalService.next() after 5sec', () => {
    const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
    interval(5000).subscribe(() => {
      expect(navigationModalServiceNextFn).toHaveBeenCalled();
    });
  });

  describe('timerChange()', () => {
    it('should be change this.timer', () => {
      const timer = 4;
      component.timerChange(timer);

      expect(component.timer).toBe(timer);
    });

    it('should be change this.isTimerShow', () => {
      component.timerChange(0);

      expect(component.isTimerShow).toBe(false);
    });
  });

  describe('resendEmailConfirmation()', () => {
    it('should be call this.navModalService.next()', () => {
      const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
      component.resendEmailConfirmation();

      expect(navigationModalServiceNextFn).toHaveBeenCalled();
      expect(component.isTimerShow).toBe(true);
    });
  });
});
