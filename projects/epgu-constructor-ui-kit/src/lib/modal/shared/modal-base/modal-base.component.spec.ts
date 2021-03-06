import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBaseComponent } from './modal-base.component';

describe('ModalBaseComponent', () => {
  let component: ModalBaseComponent;
  let fixture: ComponentFixture<ModalBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBaseComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line no-empty-function
    component.detachView = () => {};
    fixture.detectChanges();
  });

  describe('onKeydownComponent', () => {
    it('should be call closeModal if press Enter', () => {
      const spy = jest.spyOn(component, 'closeModal');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalledWith();
    });

    it('should be call closeModal if press Esc', () => {
      const spy = jest.spyOn(component, 'closeModal');
      const event = new KeyboardEvent('keydown', { key: 'Esc' });
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('onClickComponent', () => {
    it('should be call closeModal', () => {
      const spy = jest.spyOn(component, 'closeModal');
      jest.spyOn(component.elemRef.nativeElement, 'contains').mockReturnValue(true);
      const event = {
        target: {
          className: 'modal-overlay',
        },
      };
      component.onClickComponent(event as any);
      expect(spy).toHaveBeenCalledWith();
    });

    it('should be pass call closeModal', () => {
      const spy = jest.spyOn(component, 'closeModal');
      const event = new Event('click');
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('closeModal', () => {
    it('should be reset overflow', () => {
      const modalContainer = document.createElement('div');
      modalContainer.setAttribute('id', 'modal-container');
      modalContainer.innerHTML = '<div>modal</div>';
      document.body.appendChild(modalContainer);
      document.body.style.overflow = 'hidden';
      component.closeModal();
      expect(document.body.style.overflow).toBe('');
    });
  });
});
