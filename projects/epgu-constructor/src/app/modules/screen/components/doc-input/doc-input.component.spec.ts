import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DocInputComponent, DocInputComponentInterface } from './doc-input.component';


describe('DocInputComponent', () => {
  let component: DocInputComponent;
  let fixture: ComponentFixture<DocInputComponent>;
  const mockData: DocInputComponentInterface = {
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
