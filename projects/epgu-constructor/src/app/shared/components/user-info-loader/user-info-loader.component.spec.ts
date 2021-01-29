import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { UserInfoLoaderComponent } from './user-info-loader.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { UserInfoComponent } from '../user-info/user-info.component';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../core/services/logger/logger.service.stub';

describe('UserInfoLoaderComponent', () => {
  let component: UserInfoLoaderComponent;
  let fixture: ComponentFixture<UserInfoLoaderComponent>;
  let screenService: ScreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoLoaderComponent, UserInfoComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoLoaderComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
