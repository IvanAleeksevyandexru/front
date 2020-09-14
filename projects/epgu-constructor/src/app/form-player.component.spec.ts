import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerModule } from './form-player.module';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { ModalContainerComponent } from './shared/components/modal/modal-container/modal-container.component';
import { NavigationService } from './shared/services/navigation/navigation.service';


describe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormPlayerModule,
        RouterTestingModule,
        EpguLibModule.forRoot(),
      ],
      declarations: [],
      providers: [
        NavigationService,
        UnsubscribeService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub }
      ]
    }).compileComponents();
    formPlayerService = TestBed.inject(FormPlayerService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormPlayerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
