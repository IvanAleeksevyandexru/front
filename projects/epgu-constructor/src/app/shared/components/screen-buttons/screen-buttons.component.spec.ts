import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenButtonsComponent } from './screen-buttons.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { HealthService } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationModule } from '../navigation/navigation.module';
import { CoreModule } from '../../../core/core.module';
import { LocationService } from '../../../core/services/location/location.service';
import { WINDOW_PROVIDERS } from '../../../core/providers/window.provider';
import { BaseModule } from '../../base.module';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

describe('ScreenContainerComponent', () => {
  let component: ScreenButtonsComponent;
  let fixture: ComponentFixture<ScreenButtonsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CoreModule, BaseModule, RouterTestingModule, NavigationModule],
        declarations: [ScreenButtonsComponent],
        providers: [
          LocationService,
          WINDOW_PROVIDERS,
          HealthService,
          { provide: ScreenService, useClass: ScreenServiceStub },
          UnsubscribeService,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
