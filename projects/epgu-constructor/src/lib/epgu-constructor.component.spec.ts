import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpguConstructorComponent } from './epgu-constructor.component';

describe('EpguConstructorComponent', () => {
  let component: EpguConstructorComponent;
  let fixture: ComponentFixture<EpguConstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpguConstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpguConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
