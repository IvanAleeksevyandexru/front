import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';

import { AddPassportComponent } from './add-passport.component';
import { ComponentBase } from '../../../../../screen/screen.types';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { PassportModule } from '../../../../../shared/components/add-passport/passport.module';
import { ComponentListToolsService } from '../../../../components-list/services/component-list-tools/component-list-tools.service';

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

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPassportComponent, ScreenPadComponent],
      imports: [RouterTestingModule, PassportModule],
      providers: [ComponentListToolsService, HealthService],
    }).compileComponents();
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
