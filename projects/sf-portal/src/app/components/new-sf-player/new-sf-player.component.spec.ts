import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NewSfPlayerComponent } from './new-sf-player.component';
import { ActivatedRouteStub } from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfig } from '../../app.config';
import { MockProvider } from 'ng-mocks';

describe('NewSfPlayerComponent', () => {
  let component: NewSfPlayerComponent;
  let fixture: ComponentFixture<NewSfPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CookieModule.forRoot()],
      declarations: [NewSfPlayerComponent],
      providers: [
        MockProvider(AppConfig),
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSfPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
