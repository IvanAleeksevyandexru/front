import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { EventBusService, MaskHandleModule } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { MaskModule } from '../../directives/mask/mask.module';
import { FormControl, NgControl } from '@angular/forms';
import { RemoveMaskSymbols } from '@epgu/ui/models/common-enums';

describe('ConstructorMaskedInputComponent', () => {
  let component: ConstructorMaskedInputComponent;
  let fixture: ComponentFixture<ConstructorMaskedInputComponent>;
  let debugEl: DebugElement;
  const selector = 'lib-standard-masked-input';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaskModule, MaskHandleModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConstructorMaskedInputComponent],
      providers: [EventBusService, NgControl],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMaskedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugEl = fixture.debugElement.query(By.css(selector));
  });

  it('should be trigger blur', () => {
    jest.spyOn(component.blurEvent, 'emit');
    debugEl.triggerEventHandler('blur', {});
    expect(component.blurEvent.emit).toHaveBeenCalled();
  });

  describe('onChange', () => {
    const setup = (removeMaskSymbols?: RemoveMaskSymbols) => {
      component.control = new FormControl('');
      if (removeMaskSymbols) {
        component.removeMaskSymbols = removeMaskSymbols;
      }

      jest.spyOn(component.control, 'updateOn', 'get').mockReturnValue('blur');
      const setValueSpy = jest.spyOn(component.control, 'setValue');
      jest.spyOn(component.control, 'updateValueAndValidity');

      return { component, setValueSpy };
    };

    describe('when removeMaskSymbols is default', () => {
      it('should mask symbols here as it was before', () => {
        const { component, setValueSpy } = setup();

        component.onChange({ target: { value: '__' }} as unknown as Event);

        expect(setValueSpy).toHaveBeenCalledTimes(1);
        expect(setValueSpy).toHaveBeenCalledWith('__');
      });
    });

    describe('when removeMaskSymbols === RemoveMaskSymbols.PLACEHOLDERS', () => {
      it('should remove mask symbols', () => {
        const { component, setValueSpy } = setup(RemoveMaskSymbols.PLACEHOLDERS);

        component.onChange({ target: { value: '__' }} as unknown as Event);

        expect(setValueSpy).toHaveBeenCalledTimes(1);
        expect(setValueSpy).toHaveBeenCalledWith('');
      });
    });
  });
});
