import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InformationCenterPfrContainerComponent } from './information-center-pfr-container.component';

describe('InformationCenterPfrComponent', () => {
  let component: InformationCenterPfrContainerComponent;
  let fixture: ComponentFixture<InformationCenterPfrContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [InformationCenterPfrContainerComponent],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        CachedAnswersService,
        UtilsService,
        NavigationService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterPfrContainerComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    component.display$ = of(mockDisplay);
    component.isLoading$ = of(true);
    component.submitLabel$ = of('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
