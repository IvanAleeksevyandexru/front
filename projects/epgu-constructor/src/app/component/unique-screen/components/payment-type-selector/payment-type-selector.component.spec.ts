import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { PageNameComponent } from '../../../../shared/components/base/page-name/page-name.component';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { ImgPrefixerPipe } from '../../../../shared/pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../../../shared/pipes/safe/safe.pipe';
import { LongButtonComponent } from '../../../../shared/components/long-button/long-button.component';
import { NavigationService } from '../../../../shared/services/navigation/navigation.service';

describe('PaymentTypeSelectorComponent', () => {
  let component: PaymentTypeSelectorComponent;
  let fixture: ComponentFixture<PaymentTypeSelectorComponent>;
  let screenService: ScreenService;
  let navigationService: NavigationService;
  const mockComponent: ComponentDto = {
    attrs: {
      applicantType: 'success',
      state: 'success',
      states: {
        success: {
          header: 'success',
          label: '',
          clarifications: {},
          actions: [],
        },
      },
    },
    label: '',
    type: '',
    id: '12',
    value: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PaymentTypeSelectorComponent,
        NavigationComponent,
        ScreenContainerComponent,
        OutputHtmlComponent,
        ActionDirective,
        PageNameComponent,
        ActionButtonComponent,
        SafePipe,
        ImgPrefixerPipe,
        LongButtonComponent,
      ],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }, NavigationService],
    }).compileComponents();

    screenService = TestBed.inject(ScreenService);
    navigationService = TestBed.inject(NavigationService);

    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeSelectorComponent);
    component = fixture.componentInstance;
    // component.paymentTypeSelector = {
    //   applicantType: '',
    //   actions: [],
    //   clarifications: {},
    //   header: '',
    //   label: '',
    // };
    // fixture.debugElement.injector.get(ScreenService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
