import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Injector,
} from '@angular/core';
import { HelperService } from '@epgu/ui/services/helper';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBaseComponent {
  detachView: Function;
  modalResult = new BehaviorSubject(null);
  protected elemRef: ElementRef;
  /**
   * Если TRUE, то модальное окно закроется при клике на подложку
   */
  protected backdropDismiss = true;

  constructor(public injector: Injector) {
    this.elemRef = this.injector.get(ElementRef);
  }

  @HostListener('document:keydown', ['$event']) onKeydownComponent(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeModal();
    }
  }

  @HostListener('document:click', ['$event']) onClickComponent(event: MouseEvent): void {
    const target = event.target as Element;
    const isElement = this.elemRef?.nativeElement.contains(target);
    if (this.backdropDismiss && target.className === 'modal-overlay' && isElement) {
      this.closeModal();
    }
  }

  closeModal(value?: unknown): void {
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
