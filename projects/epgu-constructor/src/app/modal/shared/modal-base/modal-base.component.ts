import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';

@Component({
  template: '',
})
export class ModalBaseComponent {
  detachView: Function;

  modalResult = new BehaviorSubject<any>(null);

  constructor(private deviceDetector: DeviceDetectorService) {}
  @HostListener('document:keydown', ['$event']) onKeydownComponent(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeModal();
    }
  }

  @HostListener('document:click', ['$event']) onClickComponent(event: MouseEvent): void {
    const target = event.target as Element;
    if (target.className === 'modal-overlay') {
      this.closeModal();
    }
  }

  closeModal(value?: any): void {
    if (this.deviceDetector.isMobile) {
      document.body.style.overflow = null;
    }
    this.detachView(value || this.modalResult.value);
  }
}
