import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { SCREEN_TYPE } from '../../../constant/global';
import { QuestionsDisplayInterface } from '../../../interfaces/question-block.interface';
import { FormPlayerService } from '../../services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../services/form-player/form-player.service.stub';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { PageNameComponent } from '../../shared/components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { QuestionsScreenComponent } from './questions-screen.component';
import { ScreenService } from '../screen.service';
import { ModalService } from '../../services/modal/modal.service';
import { ModalServiceStub } from '../../services/modal/modal.service.stub';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;
  let navService: NavigationService;
  let constructorService: FormPlayerService;
  let screenService: ScreenService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  const mockData: QuestionsDisplayInterface = {
    components: [],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: SCREEN_TYPE.QUESTION
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionsScreenComponent,
        PageNameComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        NavigationComponentMock,
        ButtonComponent
      ],
      providers: [
        NavigationService,
        ScreenService,
        UnsubscribeService,
        { provide: ModalService, useClass: ModalServiceStub },
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(FormPlayerService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.answerChoose({ action: '', label: '', value: '' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
