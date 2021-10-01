import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignAppLinkComponent } from './sign-app-link.component';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { MockComponents, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
  System,
} from '@epgu/epgu-constructor-ui-kit';
import { ErrorType } from './sign-app-link.types';
import { HttpClient, HttpHandler } from '@angular/common/http';

const appLinks = [
  {
    type: 'Android',
    image: 'https://via.placeholder.com/135x40.png?text=Google+Play',
    title: 'Перейти в Google Play',
    href: 'https://play.google.com/store/apps/details?id=ru.gosuslugi.goskey'
  },
  {
    type: 'iOS',
    image: 'https://via.placeholder.com/135x40.png?text=App+Store',
    title: 'Перейти в App Store',
    href: 'https://apps.apple.com/ru/app/id1566096745'
  },
  {
    type: 'Harmony',
    image: 'https://via.placeholder.com/135x40.png?text=App+Gallery',
    title: 'Перейти в App Gallery',
    href: 'https://huaweimobileservices.com/ru/appgallery-russian'
  }
];

const mockComponent = {
  id: 'sal1',
  type: 'SignAppLink',
  label: '',
  attrs: {
    appLinks
  },
  value: {},
  visited: false,
  required: false
};

const payloadMock = {
  agent: 'Android',
  error: '',
};

describe('SignAppLinkComponent', () => {
  let component: SignAppLinkComponent;
  let fixture: ComponentFixture<SignAppLinkComponent>;
  let eventService: EventBusService;
  let formService: ComponentsListFormServiceStub;
  let control: FormGroup;
  let userAgent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SignAppLinkComponent,
        MockComponents(ComponentItemComponent)
      ],
      providers: [
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        MockProvider(ComponentsListRelationsService),
        MockProvider(HttpClient),
        MockProvider(HttpHandler),
        MockProvider(EventBusService),
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
    eventService = TestBed.inject(EventBusService);
    formService = TestBed.inject(ComponentsListFormService) as unknown as ComponentsListFormServiceStub;
    control = new FormGroup({
      id: new FormControl('id'),
      value: new FormControl(SignAppLinkComponent),
      attrs: new FormControl(mockComponent.attrs),
    });
    formService['_form'] = new FormArray([ control ]);
    fixture = TestBed.createComponent(SignAppLinkComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should render epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should be emit change for formService', () => {
    const spy = jest.spyOn(formService, 'emitChanges');
    component['emitToParentForm'](payloadMock);

    expect(spy).toHaveBeenCalled();
  });

  describe('Init', () => {
    it('should emit value when has clientAppLink and has 1 link in array', async () => {
      const spy = jest.spyOn<any, any>(component, 'emitToParentForm');
      jest.spyOn(DeviceDetectorService.prototype as any, 'system', 'get').mockReturnValueOnce(System.Android);
      component.ngOnInit();

      await waitForAsync(() => {
        expect(spy).toHaveBeenCalledWith(appLinks[0]);
        expect(component.appLinks.length).toEqual(1);
      });
    });

    it('should emit error when clientSystem not determined and has all links from appLinks', () => {
      userAgent.mockReturnValue('Another OS');

      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('notDetermined');
      expect(component.appLinks.length).toEqual(control.value.attrs.appLinks.length);
    });

    it('should emit error when JSON does not contain client system app link and has all links from appLinks', async () => {
      control = new FormGroup({
        id: new FormControl('id'),
        value: new FormControl(SignAppLinkComponent),
        attrs: new FormControl({
          appLinks: [appLinks[0], appLinks[2]]
        }),
      });
      formService['_form'] = new FormArray([ control ]);

      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      jest.spyOn(DeviceDetectorService.prototype as any, 'system', 'get').mockReturnValueOnce(System.iOS);
      component.ngOnInit();

      await waitForAsync(() => {
        expect(spy).toHaveBeenCalledWith('error', ErrorType.json);
      });
      expect(component.appLinks.length).toEqual(control.value.attrs.appLinks.length);
    });

    it('should emit error when navigator.userAgent is not available and has all links from appLinks', async () => {
      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      jest.spyOn(DeviceDetectorService.prototype as any, 'system', 'get').mockReturnValueOnce(System.Error);
      component.ngOnInit();

      await waitForAsync(() => {
        expect(spy).toHaveBeenCalledWith('error', ErrorType.userAgent);
      });
      expect(component.appLinks.length).toEqual(control.value.attrs.appLinks.length);
    });
  });
});
