import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerButtonComponent } from './answer-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AnswerButtonComponent', () => {
  let component: AnswerButtonComponent;
  let fixture: ComponentFixture<AnswerButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ AnswerButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerButtonComponent);
    component = fixture.componentInstance;
    component.data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
