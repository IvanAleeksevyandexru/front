import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddPassportScreenComponent} from './add-children-screen.component';

describe('AddPassportScreenComponent', () => {
  let component: AddPassportScreenComponent;
  let fixture: ComponentFixture<AddPassportScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPassportScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
