import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChildrenScreenComponent } from './add-children-screen.component';

describe('AddChildrenScreenComponent', () => {
  let component: AddChildrenScreenComponent;
  let fixture: ComponentFixture<AddChildrenScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChildrenScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildrenScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
