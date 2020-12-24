import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentBase } from '../../../../screen/screen.types';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { ComponentListToolsService } from '../../../components-list/services/component-list-tools/component-list-tools.service';
import { AddPassportComponent } from './add-passport.component';
import { of } from 'rxjs';
import { ScreenPadComponent } from '../../../../shared/components/screen-pad/screen-pad.component';

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
      providers: [
        CurrentAnswersService,
        ComponentListToolsService,
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
