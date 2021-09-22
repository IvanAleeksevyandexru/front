import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import {
  BaseComponentsModule,
  ConfigService, CtaModalComponent,
  DeviceDetectorService,
  DeviceDetectorServiceStub, ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { IdentificationStreamComponent } from './identification-stream.component';
import { configureTestSuite } from 'ng-bullet';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { JsonHelperServiceStub } from '../../../../core/services/json-helper/json-helper.service.stub';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { IdentificationStreamService } from '../../shared/identification-stream/identification-stream.service';
import { BaseModule } from '@epgu/ui/base';
import { ModalService } from '@epgu/ui/services/modal';
import { ScreenService } from '../../../../screen/screen.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../../core/services/html-select/html-select.service';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { AutocompletePrepareService } from '../../../../core/services/autocomplete/autocomplete-prepare.service';
import { IdentificationStreamModule } from './identification-stream.module';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { HttpClient } from '@angular/common/http';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { of } from 'rxjs';

const mockComponent = { id: 'test', type: UniqueScreenComponentTypes.IdentificationStreamComponent, arguments: { selfieId: 2, faceId: 1 }};
describe('IdentificationStreamComponent', () => {
  let component: IdentificationStreamComponent;
  let fixture: ComponentFixture<IdentificationStreamComponent>;
  let screenService: ScreenServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(CtaModalComponent)],
      imports: [BaseModule, BaseComponentsModule, IdentificationStreamModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        MockProvider(IdentificationStreamService),
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        MockProvider(AutocompletePrepareService),
        CurrentAnswersService,
        UnsubscribeService,
        MockProvider(HttpClient),
        CurrentAnswersService,
        HtmlSelectService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    screenService.component = mockComponent as any;
    fixture = TestBed.createComponent(IdentificationStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('next()', () => {
    it('should call api method()', () => {
      const spy = jest.spyOn(component['api'], 'videoIdentification').mockImplementation((...args) => of({ data: { quality: [] }} as any));
      component.result = 3 as any;

      component.next();

      expect(spy).toHaveBeenCalledWith({ faceId: 1, selfieFaceId: 2, snapshot: 3 });

    });

    it('should call switchAction()', () => {
      jest.spyOn(component['api'], 'videoIdentification').mockImplementation((...args) => of({ data: { quality: [] }} as any));
      const spySwitchAction = jest.spyOn(component['actionService'], 'switchAction').mockImplementation((...args) => null);
      component.result = 3 as any;

      component.next();

      expect(spySwitchAction).toHaveBeenCalledTimes(1);

    });

  });

  describe('record()', () => {
    it('should call terabyte upload methods()', () => {
      jest.spyOn(component['modalService'], 'openModal').mockImplementation((...args) => of({ file: {  }, status: true } as any));
      const spyUpload = jest.spyOn(component['tera'], 'uploadFile').mockImplementation((...args) => of({ file: {  }, status: true } as any));
      const spyGet = jest.spyOn(component['tera'], 'uploadFile').mockImplementation((...args) => of({ file: {  }, status: true } as any));
      component.result = 3 as any;

      component.record();

      expect(spyUpload).toHaveBeenCalledTimes(1);
      expect(spyGet).toHaveBeenCalledTimes(1);

    });

  });

});
