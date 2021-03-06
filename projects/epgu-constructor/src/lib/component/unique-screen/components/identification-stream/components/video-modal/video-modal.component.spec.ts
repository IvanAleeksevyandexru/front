import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import {
  ConfigService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LoggerService,
  LoggerServiceStub,
  JsonHelperService,
  JsonHelperServiceStub,
  EventBusService,
  UnsubscribeService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  CtaModalComponent,
} from '@epgu/epgu-constructor-ui-kit';

import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';

import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../../../../core/services/html-select/html-select.service';
import { VideoModalComponent } from './video-modal.component';
import {
  IdentificationStreamService,
  LunaPassConstructor,
} from '../../../../shared/identification-stream/identification-stream.service';

const lunaStub = ({
  checkLiveness() {
    return null;
  },
  id: 1,
  ws: {
    close() {
      return null;
    },
  },
  video: {
    srcObject: {
      getTracks() {
        return [];
      },
    },
  },
} as unknown) as LunaPassConstructor;

describe('VideoModalComponent', () => {
  let component: VideoModalComponent;
  let fixture: ComponentFixture<VideoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoModalComponent, MockComponent(CtaModalComponent)],
      imports: [BaseModule, BaseComponentsModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        MockProvider(IdentificationStreamService),
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        CurrentAnswersService,
        UnsubscribeService,
        EventBusService,
        CurrentAnswersService,
        SmuEventsService,
        HtmlSelectService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onReady()', () => {
    it('should call luna check liveness', () => {
      component.luna = lunaStub;
      const spy = jest.spyOn(component.luna, 'checkLiveness');
      component.onReady();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('close()', () => {
    it('should call ws.close', () => {
      component.luna = lunaStub;
      const spy = jest.spyOn(component.luna.ws, 'close');
      jest.spyOn(component, 'closeModal').mockImplementation((...args) => null);
      component.close();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
