import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  UnsubscribeService,
  LocationService,
  WINDOW_PROVIDERS,
  LoggerService,
  LoggerServiceStub,
  ConfigService,
  ConfigServiceStub,
  CoreUiModule,
  HealthService,
} from '@epgu/epgu-constructor-ui-kit';

import { ScreenContainerComponent } from './screen-container.component';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { ScreenServiceStub } from '@epgu/epgu-constructor/src/lib/screen/screen.service.stub';
import { PrevButtonModule } from '../prev-button/prev-button.module';
import { CoreModule } from '@epgu/epgu-constructor/src/lib/core/core.module';
import { BaseModule } from '@epgu/epgu-constructor/src/lib/shared/base.module';
import { MockModule } from 'ng-mocks';

describe('ScreenContainerComponent', () => {
  let component: ScreenContainerComponent;
  let fixture: ComponentFixture<ScreenContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CoreModule, MockModule(CoreUiModule), BaseModule, RouterTestingModule, PrevButtonModule],
        declarations: [ScreenContainerComponent],
        providers: [
          LocationService,
          WINDOW_PROVIDERS,
          HealthService,
          { provide: ScreenService, useClass: ScreenServiceStub },
          { provide: LoggerService, useClass: LoggerServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          UnsubscribeService,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
