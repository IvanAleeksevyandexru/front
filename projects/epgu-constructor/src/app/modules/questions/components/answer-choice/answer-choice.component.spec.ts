import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerChoiceComponent, IData } from './answer-choice.component'

describe('AnswerChoiceComponent', () => {
  let component: AnswerChoiceComponent;
  let fixture: ComponentFixture<AnswerChoiceComponent>;
  let mockData: Partial<IData> = {
    hint: '',
    action: '',
    label: '',
    value: ''
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerChoiceComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
