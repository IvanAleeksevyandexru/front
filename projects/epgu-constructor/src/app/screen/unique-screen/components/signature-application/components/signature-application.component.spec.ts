import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, LoaderComponent, SafeHtmlPipe } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';

import { SignatureApplicationComponent } from './signature-application.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';
import { OutputHtmlComponent } from '../../../../../shared/components/output-html/output-html.component';
import { ConfigService } from '../../../../../config/config.service';
import { ScreenService } from '../../../../screen.service';
import { ScreenServiceStub } from '../../../../screen.service.stub';
import { ConfigServiceStub } from '../../../../../config/config.service.stub';

describe('SignatureApplicationComponent', () => {
  let component: SignatureApplicationComponent;
  let fixture: ComponentFixture<SignatureApplicationComponent>;

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
      providers: [
        NavigationService,
        ConfigService,
        { provide: ScreenService,useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    // Нужно для решения ошибки при переходе по ссылке
    delete window.location;
    // @ts-ignore
    window.location = {
      href: '',
    };
    fixture = TestBed.createComponent(SignatureApplicationComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(ScreenService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
