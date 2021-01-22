import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { ComponentListModalComponent } from './component-list-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListComponent } from '../../../../component/shared/components/components-list/components-list.component';
import { ScreenStore, ScreenTypes } from '../../../../screen/screen.types';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';


xdescribe('CustomScreenComponent', () => {
  let component: ComponentListModalComponent;
  let fixture: ComponentFixture<ComponentListModalComponent>;
  let navModalService: NavigationModalService;
  let screenService: ScreenService;
  let unsubscribeService: UnsubscribeService;
  let ComponentsListComponentMock = MockComponent(ComponentsListComponent);
  const screenDataMock: ScreenStore = {
    display: {
      components: [],
      terminal: false,
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: ScreenTypes.CUSTOM
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EpguLibModule,
      ],
      declarations: [
        ComponentListModalComponent,
        ComponentsListComponentMock
      ],
      providers: [
        NavigationModalService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentListModalComponent);
    component = fixture.componentInstance;

    navModalService = fixture.debugElement.injector.get(NavigationModalService);
    unsubscribeService = fixture.debugElement.injector.get(UnsubscribeService);
    screenService = fixture.debugElement.injector.get(ScreenService);

    screenService.updateScreenStore(screenDataMock);
    component.changeComponentsList({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
