import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsBlockScreenComponent } from './invitation-error.component';

describe('ErrorsBlockScreenComponent', () => {
  let component: ErrorsBlockScreenComponent;
  let fixture: ComponentFixture<ErrorsBlockScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorsBlockScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsBlockScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
