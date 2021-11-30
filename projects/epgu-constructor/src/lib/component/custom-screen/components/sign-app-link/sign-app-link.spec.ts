import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MockComponents, MockProvider } from 'ng-mocks';

import { System } from '@epgu/epgu-constructor-types';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ErrorType } from './sign-app-link.types';
import { SignAppLinkComponent } from './sign-app-link.component';

const appLinks = [
  {
    type: 'Android',
    image: 'https://via.placeholder.com/135x40.png?text=Google+Play',
    title: 'Перейти в Google Play',
    href: 'https://play.google.com/store/apps/details?id=ru.gosuslugi.goskey',
  },
  {
    type: 'iOS',
    image: 'https://via.placeholder.com/135x40.png?text=App+Store',
    title: 'Перейти в App Store',
    href: 'https://apps.apple.com/ru/app/id1566096745',
  },
  {
    type: 'Harmony',
    image: 'https://via.placeholder.com/135x40.png?text=App+Gallery',
    title: 'Перейти в App Gallery',
    href: 'https://huaweimobileservices.com/ru/appgallery-russian',
  },
];

const mockComponent = {
  id: 'sal1',
  type: 'SignAppLink',
  label: '',
  attrs: {
    appLinks,
  },
  value: {},
  visited: false,
  required: false,
};

const payloadMock = {
  agent: 'Android',
  error: '',
};

describe('SignAppLinkComponent', () => {
  let component: SignAppLinkComponent;
  let control: FormGroup;
  let deviceDetectorService: DeviceDetectorService;
  let deviceDetectorServiceSpy: jest.SpyInstance;
  let eventService: EventBusService;
  let fixture: ComponentFixture<SignAppLinkComponent>;
  let formService: ComponentsListFormServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignAppLinkComponent, MockComponents(ComponentItemComponent)],
      providers: [
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        MockProvider(ComponentsListRelationsService),
        MockProvider(EventBusService),
        MockProvider(HttpClient),
        MockProvider(HttpHandler),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    deviceDetectorServiceSpy = jest.spyOn(deviceDetectorService, 'system', 'get');
    eventService = TestBed.inject(EventBusService);
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    control = new FormGroup({
      id: new FormControl('id'),
      value: new FormControl(SignAppLinkComponent),
      attrs: new FormControl(mockComponent.attrs),
    });
    formService['_form'] = new FormArray([control]);
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
    it('should emit value when has clientAppLink and has 1 link in array', () => {
      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      deviceDetectorServiceSpy.mockReturnValue(System.Android);
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith(appLinks[0]);
      expect(component.appLinks.length).toEqual(1);
    });

    it('should set all links if System is "Desktop"', () => {
      deviceDetectorServiceSpy.mockReturnValue(System.Desktop);
      component.ngOnInit();

      expect(component.appLinks.length).toEqual(mockComponent.attrs.appLinks.length);
    });

    it('should emit error when clientSystem not determined and has all links from appLinks', () => {
      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      deviceDetectorServiceSpy.mockReturnValue(System.NotDetermined);
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('notDetermined');
      expect(component.appLinks.length).toEqual(control.value.attrs.appLinks.length);
    });

    it('should emit error when JSON does not contain client system app link and has all links from appLinks', () => {
      control = new FormGroup({
        id: new FormControl('id'),
        value: new FormControl(SignAppLinkComponent),
        attrs: new FormControl({
          appLinks: [appLinks[0], appLinks[2]],
        }),
      });
      formService['_form'] = new FormArray([control]);

      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      deviceDetectorServiceSpy.mockReturnValue(System.iOS);
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('error', ErrorType.json);
      expect(component.appLinks.length).toEqual(control.value.attrs.appLinks.length);
    });

    it('should emit error when navigator.userAgent is not available and has all links from appLinks', () => {
      const spy = jest.spyOn<SignAppLinkComponent, any>(component, 'emitToParentForm');
      deviceDetectorServiceSpy.mockReturnValue(System.Error);
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('error', ErrorType.userAgent);
      expect(component.appLinks.length).toEqual(control.value.attrs.appLinks.length);
    });
  });
});
