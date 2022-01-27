import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FrameNewSfPlayerComponent } from './frame-new-sf-player.component';
import { ActivatedRouteStub } from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewSfPlayerComponent', () => {
  let component: FrameNewSfPlayerComponent;
  let fixture: ComponentFixture<FrameNewSfPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CookieModule.forRoot()],
      declarations: [FrameNewSfPlayerComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameNewSfPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
