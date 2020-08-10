import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpgucScreenPadComponent } from './epguc-screen-pad.component';

describe('AppCardComponent', () => {
  let component: EpgucScreenPadComponent;
  let fixture: ComponentFixture<EpgucScreenPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpgucScreenPadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpgucScreenPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
