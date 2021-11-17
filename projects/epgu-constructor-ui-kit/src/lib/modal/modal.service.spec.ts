import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { ModalContainerComponent } from './shared/modal-container/modal-container.component';

@Component({
  template: '',
})
class BlankComponent {}

// TODO: починить тест
xdescribe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlankComponent, ModalContainerComponent],
      providers: [DeviceDetectorService, ModalService],
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
