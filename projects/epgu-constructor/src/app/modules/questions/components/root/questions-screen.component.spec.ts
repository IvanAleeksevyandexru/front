import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { QuestionsScreenComponent } from './questions-screen.component'
import { NavigationService } from '../../../../layout/service/navigation/navigation.service'
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service'
import { EgpuResponseQuestionsDisplayInterface } from '../interface/question-block.interface'
import { COMPONENT_TYPE } from '../../../../../constant/global'

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;
  const mockData: EgpuResponseQuestionsDisplayInterface = {
    components: [],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: COMPONENT_TYPE.COMPONENT
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
