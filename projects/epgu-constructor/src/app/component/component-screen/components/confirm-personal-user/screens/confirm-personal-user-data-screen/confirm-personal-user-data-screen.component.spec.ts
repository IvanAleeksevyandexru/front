import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ToolsService } from '../../../../../../screen/services/tools/tools.service';
import { ConfirmUserData } from './confirm-personal-user-data-screen.types';
import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';



describe('ConfirmPersonalUserDataScreenComponent', () => {
  let component: ConfirmPersonalUserDataScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataScreenComponent>;
  const mockData: ConfirmUserData = {
    attrs: {
      fields: [],
      actions: []
    },
    id: '',
    label: '',
    type: '',
    value: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserDataScreenComponent ],
      providers: [CurrentAnswersService, ToolsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
