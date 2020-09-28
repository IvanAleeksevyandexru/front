import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ComponentBase } from '../../../../../screen.types';



describe('ConfirmPersonalUserEmailComponent', () => {
  let component: ConfirmPersonalUserEmailScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserEmailScreenComponent>;
  const mockData: ComponentBase = {
    attrs: {},
    id: '',
    label: '',
    value: '',
    type: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserEmailScreenComponent ],
      providers: [CurrentAnswersService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserEmailScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
