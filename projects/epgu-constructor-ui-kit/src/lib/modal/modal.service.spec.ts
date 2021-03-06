import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModalService } from './modal.service';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { ModalContainerComponent } from './shared/modal-container/modal-container.component';

@Component({
  template: '',
})
class BlankComponent {}

describe('ModalService', () => {
  let fixture: ComponentFixture<ModalContainerComponent>;
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
    fixture = TestBed.createComponent(ModalContainerComponent);
    service = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('isModalOpen()', () => {
    expect(service.isModalOpen()).toBeFalsy();

    TestBed.createComponent(ModalContainerComponent);
    service.createModal(BlankComponent, {});

    expect(service.isModalOpen()).toBeTruthy();
  });

  describe('createModal', () => {
    it('should set overflow hidden', () => {
      document.body.style.overflow = null;
      service.createModal(ModalContainerComponent);
      expect(document.body.style.overflow).toBe('hidden');
    });
  });
});
