import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamModule } from 'ngx-webcam';
import { WebcamShootComponent } from './webcam-shoot.component';
import { WebcamEvents } from './webcamevents';

describe('WebcamShootComponent', () => {
  let component: WebcamShootComponent;
  let fixture: ComponentFixture<WebcamShootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [WebcamModule],
      declarations: [WebcamShootComponent],
      providers: [WebcamEvents],
    }).compileComponents();
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
