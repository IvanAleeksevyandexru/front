import { EpguLibModule } from 'epgu-lib'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { COMPONENT_TYPE } from '../../../../../constant/global'
import { NavigationService } from '../../../../layout/service/navigation/navigation.service'
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service'
import { QuestionsDisplayInterface } from '../interface/question-block.interface'
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
    type: COMPONENT_TYPE.COMPONENT
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
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
