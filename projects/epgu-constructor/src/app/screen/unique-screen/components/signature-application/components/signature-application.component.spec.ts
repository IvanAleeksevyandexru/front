import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, LoaderComponent, SafeHtmlPipe } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';

import { SignatureApplicationComponent } from './signature-application.component';
import { Display, ScreenTypes } from '../../../../screen.types';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';
import { OutputHtmlComponent } from '../../../../../shared/components/output-html/output-html.component';

describe('SignatureApplicationComponent', () => {
  let component: SignatureApplicationComponent;
  let fixture: ComponentFixture<SignatureApplicationComponent>;
  const displayDataMock: Display = {
    components: [
      {
        attrs: {
          actions: [{ action: 'getNextScreen', label: 'Перейти  в личный кабинет', value: '' }],
          image: { src: 'link_to_img_MP' },
        },
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        SignatureApplicationComponent,
        ScreenContainerComponent,
        PageNameComponent,
        NavigationComponent,
        ButtonComponent,
        LoaderComponent,
        OutputHtmlComponent,
        SafeHtmlPipe,
      ],
      providers: [NavigationService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;
    component.data = displayDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
