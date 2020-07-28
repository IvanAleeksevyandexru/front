import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsBlockComponent } from './questions-block.component';

describe('QuestionsBlockComponent', () => {
  let component: QuestionsBlockComponent;
  let fixture: ComponentFixture<QuestionsBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
