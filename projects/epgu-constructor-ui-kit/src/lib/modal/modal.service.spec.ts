import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { configureTestSuite } from 'ng-bullet';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { ModalContainerComponent } from './shared/modal-container/modal-container.component';

@Component({
  template: ''
})
class BlankComponent { }

describe('ModalService', () => {
  let service: ModalService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BlankComponent, ModalContainerComponent],
      providers: [DeviceDetectorService, ModalService],
      imports: [HttpClientModule]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [BlankComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(ModalService);
  });

  it('isModalOpen()', () => {
    expect(service.isModalOpen()).toBeFalsy();

    TestBed.createComponent(ModalContainerComponent);
    service.createModal(BlankComponent, {});

    expect(service.isModalOpen()).toBeTruthy();
  });
});
