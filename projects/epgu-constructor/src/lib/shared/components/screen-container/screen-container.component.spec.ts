import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from '@epgu/epgu-lib';
import {
  UnsubscribeService,
  LocationService,
  WINDOW_PROVIDERS,
  LoggerService,
  LoggerServiceStub, ConfigService, ConfigServiceStub
} from '@epgu/epgu-constructor-ui-kit';

import { ScreenContainerComponent } from './screen-container.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationModule } from '../navigation/navigation.module';
import { CoreModule } from '../../../core/core.module';
import { BaseModule } from '../../base.module';

describe('ScreenContainerComponent', () => {
  let component: ScreenContainerComponent;
  let fixture: ComponentFixture<ScreenContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CoreModule, BaseModule, RouterTestingModule, NavigationModule],
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
