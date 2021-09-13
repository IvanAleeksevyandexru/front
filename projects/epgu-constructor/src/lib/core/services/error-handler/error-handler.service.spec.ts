import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { ErrorHandlerService, ModalFailureType } from './error-handler.service';
import {
  ConfigService,
  ConfigServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../navigation/navigation.service';
import { NavigationServiceStub } from '../navigation/navigation.service.stub';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../../shared/services/dictionary/dictionary-tools.service.stub';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorHandlerService,
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ErrorHandlerService);
  });

  describe('response', () => {
    it('dictionary/mzrf_lpu_equeue_smev3', () => {
      const response = new HttpResponse({
        status: 200,
        url: 'dictionary/mzrf_lpu_equeue_smev3',
        body: {
          error: {
            code: 0,
            message: 'operation crashed',
          },
          items: [
            {
              value: 'FAILURE',
            },
          ],
        },
      });


      jest.spyOn(service, 'showModalFailure');
      service.handleResponse({}, response);
      expect(service.showModalFailure).toHaveBeenCalledWith(
        'Время сессии истекло, перейдите к началу',
        true,
        ModalFailureType.SESSION,
      );
    });
  });
});
