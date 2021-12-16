import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import {
  DownloadService,
  DownloadServiceStub,
  ConfigService,
  ConfigServiceStub,
  LoggerService,
  LoggerServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../../core/core.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

import { ConstructorDadataWidgetComponent } from './constructor-dadata-widget.component';
import { BaseModule } from '../../base.module';

describe('ConstructorDadataWidgetComponent', () => {
  let component: ConstructorDadataWidgetComponent;
  let fixture: ComponentFixture<ConstructorDadataWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorDadataWidgetComponent],
      imports: [CoreModule, BaseModule, RouterTestingModule, HttpClientModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDadataWidgetComponent);
    component = fixture.componentInstance;
    component.simpleMode = true;
    component.clearable = true;
    component.externalApiUrl = '';
    component.control = new FormControl();
    component.hideHouseCheckbox = false;
    component.hideLevels = [];
    component.id = '1';
    component.validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
