import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockModule } from 'ng-mocks';
import { EpguLibModule } from 'epgu-lib';
import { UnsubscribeService } from 'projects/epgu-constructor/src/app/core/services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { InvitationErrorComponent } from './invitation-error.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ScreenPadComponent } from '../../../../shared/components/screen-pad/screen-pad.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { HelperTextComponent } from '../../../../shared/components/base-components/helper-text/helper-text.component';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../shared/components/components-list/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../core/services/location/location.service.stub';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../../core/services/logger/logger.service.stub';
import { ComponentBase } from '../../../../screen/screen.types';

describe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  const mockData = { label: '', attrs: { url: '' }, id: '', type: '' } as ComponentBase;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InvitationErrorComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          ScreenPadComponent,
          OutputHtmlComponent,
          LabelComponent,
          ConstructorPlainInputComponent,
          HelperTextComponent
        )
      ],
      imports: [MockModule(EpguLibModule)],
      providers: [
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        ValidationService,
        UnsubscribeService,
        CurrentAnswersService,
        DateRangeService,
        DatesToolsService,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
