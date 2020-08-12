import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnilsComponent } from './snils.component';

describe('SnilsComponent', () => {
  let component: SnilsComponent;
  let fixture: ComponentFixture<SnilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
