import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs';
import { ScreenModalResolverComponent } from './screen-modal-resolver.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { UniqueComponentModalModule } from '../components/unique-component-modal/unique-component-modal.module';
import { UniqueComponentModalComponent } from '../components/unique-component-modal/unique-component-modal.component';
import { InfoComponentModalComponent } from '../components/info-component-modal/info-component-modal.component';
import { InfoComponentModalModule } from '../components/info-component-modal/info-component-modal.module';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../core/services/navigation-modal/navigation-modal.service.stub';
import { ScreenModalService } from '../screen-modal.service';
import { ScreenModalServiceStub } from '../screen-modal.service.stub';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';

jest.useFakeTimers();

describe('ScreenModalResolverComponent', () => {
  let component: ScreenModalResolverComponent;
  let fixture: ComponentFixture<ScreenModalResolverComponent>;
  let screenService: ScreenService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenModalResolverComponent],
      imports: [UniqueComponentModalModule, InfoComponentModalModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    })
      .overrideComponent(ScreenModalResolverComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
          entryComponents: [UniqueComponentModalComponent, InfoComponentModalComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.screenType = ScreenTypes.UNIQUE;
    screenService.buttons = [];
    fixture = TestBed.createComponent(ScreenModalResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('createComponent', () => {
    it('should be create component', () => {
      jest.runAllTimers();
      expect(component.componentRef.instance).toBeInstanceOf(UniqueComponentModalComponent);
    });

    it('should be return error', () => {
      try {
        jest
          .spyOn(screenService, 'screenType$', 'get')
          .mockReturnValue(of('test error type' as any));
        component.ngAfterViewInit();
        jest.runAllTimers();
      } catch (e) {
        expect(e.message).toBe('We cant find modal component for screen type: test error type');
      }
    });
  });

  describe('destroyComponent', () => {
    it('should be destroy component', () => {
      jest.runAllTimers();
      const spy = jest.spyOn(component.componentRef, 'destroy');
      screenService.screenType = ScreenTypes.INFO;
      component.ngAfterViewInit();
      expect(spy).toHaveBeenCalledWith();
    });

    it('should be not destroy component if component undefined', () => {
      jest.runAllTimers();
      const spy = jest.spyOn(component.componentRef, 'destroy');
      component.ngAfterViewInit();
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
