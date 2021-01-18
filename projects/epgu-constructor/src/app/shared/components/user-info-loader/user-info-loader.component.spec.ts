import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { UserInfoLoaderComponent } from './user-info-loader.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

describe('UserInfoLoaderComponent', () => {
  let component: UserInfoLoaderComponent;
  let fixture: ComponentFixture<UserInfoLoaderComponent>;
  let screenService: ScreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoLoaderComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
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
