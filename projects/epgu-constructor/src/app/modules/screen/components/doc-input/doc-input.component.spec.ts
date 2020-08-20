import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocInputComponent, EgpuResponseComponentInterfaceForDocInput } from './doc-input.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DocInputComponent', () => {
  let component: DocInputComponent;
  let fixture: ComponentFixture<DocInputComponent>;
  let mockData: EgpuResponseComponentInterfaceForDocInput = {
    attrs: { fields: [{
      fieldName: 'some',
      label: 'some label',
      type: 'input'
    }] },
    id: '1',
    label: 'some another label',
    type: 'some type',
    value: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ DocInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocInputComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
