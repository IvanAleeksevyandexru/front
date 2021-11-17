import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { DefaultUniqueScreenWrapperComponent } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { ScreenPadComponent } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { FieldListScreenComponent } from './field-list-screen.component';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';

const mockData = {
  attrs: {
    style: {},
  },
  visited: true,
  label: '',
  type: '',
  value: '',
  id: '',
};

describe('FieldListScreenComponent', () => {
  let component: FieldListScreenComponent;
  let fixture: ComponentFixture<FieldListScreenComponent>;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FieldListScreenComponent,
        MockComponent(DefaultUniqueScreenWrapperComponent),
        MockComponent(ScreenPadComponent),
      ],
      imports: [RouterTestingModule, MockModule(FieldListModule)],
      providers: [
        MockProvider(CurrentAnswersService),
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldListScreenComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockData as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
