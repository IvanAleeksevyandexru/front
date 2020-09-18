import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CheckboxComponent, FeedIconComponent, LoaderComponent } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';

import { SignatureApplicationComponent } from './signature-application.component';
import { Display, ScreenTypes } from '../../../../screen.types';
import { ApplicationInterface } from '../models/application.interface';
import { LinkComponent } from './link/link.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';

describe('SignatureApplicationComponent', () => {
  let component: SignatureApplicationComponent;
  let fixture: ComponentFixture<SignatureApplicationComponent>;
  const displayDataMock: Display = {
    components: [
      {
        attrs: {},
        id: 'sig1',
        label: '',
        required: true,
        type: 'EsepSign',
        value: '"{"url":"http://yandex.ru"}"',
      },
    ],
    header: 'Подписание заявления',
    id: 's42',
    name: 'Подписание заявления',
    submitLabel: 'Подписать',
    type: ScreenTypes.UNIQUE,
  };
  const applicationInfoMock: ApplicationInterface = {
    name: '2020_06_22_2.PDF',
    link: {
      pdf: '',
      xml: '',
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [
        SignatureApplicationComponent,
        LinkComponent,
        ScreenContainerComponent,
        PageNameComponent,
        ScreenPadComponent,
        NavigationComponent,
        ButtonComponent,
        CheckboxComponent,
        FeedIconComponent,
        LoaderComponent,
      ],
      providers: [FormBuilder, UtilsService, NavigationService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;
    component.applicationInfo = applicationInfoMock;
    component.data = displayDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
