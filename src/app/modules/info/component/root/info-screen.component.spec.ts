import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScreenComponent } from './info-screen.component';

describe('InfoComponent', () => {
  let component: InfoScreenComponent;
  let fixture: ComponentFixture<InfoScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
