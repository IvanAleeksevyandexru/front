import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HelperService } from 'epgu-lib';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBaseComponent {
  detachView: Function;

  modalResult = new BehaviorSubject(null);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeModal(value?: any): void {
    if (HelperService.isTouchDevice()) {
      document.body.style.overflow = null;
      const screenResolver = document.querySelector<HTMLElement>(
        'epgu-constructor-screen-resolver',
      );

      if (screenResolver) {
        screenResolver.style.visibility = 'visible';
      }
    }
    this.detachView(value || this.modalResult.value);
  }
}
