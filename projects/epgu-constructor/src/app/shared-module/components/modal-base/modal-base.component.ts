import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: '',
})
export class ModalBaseComponent {
  detachView: Function;

  modalResult = new BehaviorSubject<any>(null);

  @HostListener('document:keydown', ['$event']) onKeydownComponent(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.detachView(this.modalResult.value);
  }
}
