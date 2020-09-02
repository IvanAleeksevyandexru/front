import { TestBed } from '@angular/core/testing';

import { FormPlayerService } from './form-player.service';
import { RestService } from './services/rest/rest.service';
import { RestServiceStub } from './services/rest/rest.service.stub';
import { ComponentStateService } from './services/component-state/component-state.service';
import { ScreenService } from './screen/screen.service';

describe('FormPlayerService', () => {
  let service: FormPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerService,
        ComponentStateService,
        ScreenService,
        { provide: RestService, useClass: RestServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
