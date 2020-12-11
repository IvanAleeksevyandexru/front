import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolsService } from '../../../shared/services/tools/tools.service';
import { SharedModule } from '../../../../shared/shared.module';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { AddPassportComponent } from './add-passport.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';

import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';

describe('AddPassportComponent', () => {
  let component: AddPassportComponent;
  let fixture: ComponentFixture<AddPassportComponent>;
  const mockData: ComponentBase = {
    attrs: { fields: [] },
    id: '',
    label: '',
    type: '',
    value: '{}', // json-string friendly
    visited: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPassportComponent],
      imports: [SharedModule, RouterTestingModule, PassportModule],
      providers: [
        CurrentAnswersService, 
        ToolsService, 
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },      
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
