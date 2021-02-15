import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockModule } from 'ng-mocks';
import { ComponentListModalComponent } from './component-list-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenTypes } from '../../../../screen/screen.types';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ScreenModalServiceStub } from '../../screen-modal.service.stub';
import { CustomScreenService } from '../../../../screen/custom-screen/custom-screen.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { ComponentsListModule } from '../../../../component/shared/components/components-list/components-list.module';
import { UniqueComponentModalModule } from '../unique-component-modal/unique-component-modal.module';
import { InfoComponentModalModule } from '../info-component-modal/info-component-modal.module';
import { RouterTestingModule } from '@angular/router/testing';

//TODO дописать тесты
describe('ComponentListModalComponent', () => {
  let component: ComponentListModalComponent;
  let fixture: ComponentFixture<ComponentListModalComponent>;
  let screenService: ScreenService;

  const screenDataMock = {
    components: [],
    terminal: false,
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: ScreenTypes.CUSTOM
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(EpguLibModule),
        ComponentsListModule,
        UniqueComponentModalModule,
        InfoComponentModalModule
      ],
      declarations: [
        ComponentListModalComponent
      ],
      providers: [
        NavigationModalService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        CustomScreenService,
        DatesToolsService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentListModalComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);

    screenService.display = screenDataMock as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
