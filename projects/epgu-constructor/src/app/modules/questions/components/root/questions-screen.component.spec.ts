import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { SCREEN_TYPE } from '../../../../../constant/global'
import { QuestionsDisplayInterface } from '../../../../../interfaces/question-block.interface'
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service'
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service'
import { QuestionsScreenComponent } from './questions-screen.component'

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;
  const mockData: QuestionsDisplayInterface = {
    components: [],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: SCREEN_TYPE.COMPONENT
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ QuestionsScreenComponent ],
      providers: [
        NavigationService,
        UnsubscribeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
