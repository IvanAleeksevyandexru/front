import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { AddNewChildFormComponent } from './add-new-child-form.component';


describe('AddNewChildFormComponent', () => {
  let component: AddNewChildFormComponent;
  let fixture: ComponentFixture<AddNewChildFormComponent>;
  let mockData = {
    childrenList: [ { birthDate: '', id: '' } ],
    child: [ { birthDate: '', id: '' } ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ FormsModule ],
      declarations: [ AddNewChildFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewChildFormComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
