import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { AddChildrenScreenComponent } from './add-children-screen.component';
import { EgpuResponseComponentInterface } from '../../../../../../../interfaces/epgu.service.interface'


describe('AddChildrenScreenComponent', () => {
  let component: AddChildrenScreenComponent;
  let fixture: ComponentFixture<AddChildrenScreenComponent>;
  const mockData: EgpuResponseComponentInterface = {
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
