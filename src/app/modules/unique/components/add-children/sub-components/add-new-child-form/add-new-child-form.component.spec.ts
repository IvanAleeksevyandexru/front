import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewChildFormComponent } from './add-new-child-form.component';

describe('AddNewChildFormComponent', () => {
  let component: AddNewChildFormComponent;
  let fixture: ComponentFixture<AddNewChildFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewChildFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewChildFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
