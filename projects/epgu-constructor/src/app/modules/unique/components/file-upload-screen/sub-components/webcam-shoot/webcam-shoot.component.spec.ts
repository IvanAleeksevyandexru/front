import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamShootComponent } from './webcam-shoot.component';

describe('WebcamShootComponent', () => {
  let component: WebcamShootComponent;
  let fixture: ComponentFixture<WebcamShootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcamShootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamShootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
