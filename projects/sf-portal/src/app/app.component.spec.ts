import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule } from 'ngx-cookie';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  WINDOW,
} from '@epgu/epgu-constructor-ui-kit';
import { YaMetricService } from '@epgu/ui/services/ya-metric';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, CookieModule.forRoot()],
      declarations: [AppComponent],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: WINDOW, useValue: Window },
        { provide: YaMetricService, useValue: { init: () => null } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
