import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { SCREEN_TYPE } from '../../../../../constant/global';
import { QuestionsDisplayInterface } from '../../../../../interfaces/question-block.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub';
import { NavigationComponent } from '../../../../shared-module/components/navigation/navigation.component';
import { PageNameComponent } from '../../../../shared-module/components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../../../shared-module/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../../../shared-module/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { QuestionsScreenComponent } from './questions-screen.component';

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;
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
        { provide: ConstructorService, useClass: ConstructorServiceStub },
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.answerChoose({ action: '', label: '', value: ''});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
