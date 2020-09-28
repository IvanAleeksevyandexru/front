import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentStateService } from '../../../../../../components/component-state.service';
import { ToolsService } from '../../../../../../shared/services/tools/tools.service';
import { ConfirmUserData } from '../../../../types/confirm-user-data.types';
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
      providers: [ComponentStateService, ToolsService]
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
