import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentWrapperComponent } from '../../shared/component-wrapper.component';
import { ScreenPadComponent } from '../../../../shared/components/screen-pad/screen-pad.component';
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FieldListScreenComponent,
        MockComponent(ComponentWrapperComponent),
        MockComponent(ScreenPadComponent),
      ],
      imports: [
        RouterTestingModule,
        MockModule(FieldListModule)
      ],
      providers: [
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    }).compileComponents();
  }));

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
