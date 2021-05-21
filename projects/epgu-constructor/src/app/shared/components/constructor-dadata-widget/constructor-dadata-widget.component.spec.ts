import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { CoreModule } from '../../../core/core.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../core/services/utils/utils.service.stub';
import { ConstructorDadataWidgetComponent } from './constructor-dadata-widget.component';
import { BaseModule } from '../../base.module';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

describe('ConstructorDadataWidgetComponent', () => {
  let component: ConstructorDadataWidgetComponent;
  let fixture: ComponentFixture<ConstructorDadataWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorDadataWidgetComponent],
      imports: [CoreModule, BaseModule, RouterTestingModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
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
