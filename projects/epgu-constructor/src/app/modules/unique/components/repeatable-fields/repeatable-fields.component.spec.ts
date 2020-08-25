import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatableFieldsComponent } from './repeatable-fields.component';

describe('RepeatableFieldsComponent', () => {
  let component: RepeatableFieldsComponent;
  let fixture: ComponentFixture<RepeatableFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatableFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatableFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
