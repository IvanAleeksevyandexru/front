import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ScreenPadComponent,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { MockComponent, MockProvider } from 'ng-mocks';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { AddPassportComponent } from './add-passport.component';
import { SuggestHandlerService } from '../../../../../shared/services/suggest-handler/suggest-handler.service';
import { mockData } from './add-passport.mock';
import { PassportComponent } from '../../../../../shared/components/add-passport/passport.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddPassportComponent', () => {
  let component: AddPassportComponent;
  let fixture: ComponentFixture<AddPassportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPassportComponent, ScreenPadComponent, MockComponent(PassportComponent)],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        MockProvider(SuggestHandlerService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportComponent);
    component = fixture.componentInstance;
    component.attrs = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
