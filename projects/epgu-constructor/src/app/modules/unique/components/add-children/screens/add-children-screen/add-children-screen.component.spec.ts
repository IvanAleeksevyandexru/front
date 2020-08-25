import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { AddChildrenScreenComponent } from './add-children-screen.component';


describe('AddChildrenScreenComponent', () => {
  let component: AddChildrenScreenComponent;
  let fixture: ComponentFixture<AddChildrenScreenComponent>;
  const mockData: ComponentInterface = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: '{"items":[]}'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ AddChildrenScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildrenScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
