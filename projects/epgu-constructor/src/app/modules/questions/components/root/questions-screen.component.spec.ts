import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsScreenComponent } from './questions-screen.component';

describe('QuestionsBlockComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
