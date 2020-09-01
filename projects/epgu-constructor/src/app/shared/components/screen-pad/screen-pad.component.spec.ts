import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenPadComponent } from './screen-pad.component';

describe('AppCardComponent', () => {
  let component: ScreenPadComponent;
  let fixture: ComponentFixture<ScreenPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenPadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
