import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ScreenModalComponent } from './screen-modal.component';
import { ComponentListModalComponent } from './components/component-list-modal/component-list-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ComponentsListModule } from '../../component/shared/components/components-list/components-list.module';
import { UniqueComponentModalModule } from './components/unique-component-modal/unique-component-modal.module';
import { InfoComponentModalModule } from './components/info-component-modal/info-component-modal.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationModalService } from '../../core/services/navigation-modal/navigation-modal.service';
import { ScreenService } from '../../screen/screen.service';
import { ScreenModalService } from './screen-modal.service';
import { CustomScreenService } from '../../screen/custom-screen/custom-screen.service';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { ScreenTypes } from '../../screen/screen.types';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { HtmlRemoverService } from '../../shared/services/html-remover/html-remover.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { ValueLoaderService } from '../../shared/services/value-loader/value-loader.service';
import { CachedAnswersService } from '../../shared/services/cached-answers/cached-answers.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// TODO написать тесты
describe('ScreenModalComponent', () => {
  let component: ScreenModalComponent;
  let fixture: ComponentFixture<ScreenModalComponent>;
  let screenService: ScreenService;

  beforeEach(async() => {
     await TestBed.configureTestingModule({
      declarations: [ScreenModalComponent, MockComponent(ComponentListModalComponent)],
      imports: [
        RouterTestingModule,
        BaseModule,
        ComponentsListModule,
        UniqueComponentModalModule,
        InfoComponentModalModule,
        HttpClientTestingModule,
      ],
      providers: [
        NavigationModalService,
        ScreenService,
        ScreenModalService,
        FormPlayerApiService,
        FormPlayerService,
        CustomScreenService,
        DatesToolsService,
        HtmlRemoverService,
        CurrentAnswersService,
        ValueLoaderService,
        CachedAnswersService,
        UnsubscribeService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenModalComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.isMobile = true;
    component.isValid = true;
    screenService.screenType = ScreenTypes.CUSTOM;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
