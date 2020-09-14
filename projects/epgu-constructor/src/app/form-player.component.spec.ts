import { TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule } from 'epgu-lib';

import { FormPlayerComponent } from './form-player.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ModalContainerComponent } from './shared/components/modal/modal-container/modal-container.component';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';

describe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModule,
      ],
      declarations: [
        FormPlayerComponent,
        ModalContainerComponentMock
      ],
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
