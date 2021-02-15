import { MaskTransformDirective } from './mask-transform.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'epgu-constructor-mask-transform-test-component',
  template: `<input
    type="text"
    [epgu-constructor-mask-transform]="mask"
    [maskOptions]="maskOptions"
  />`,
})
class MaskTransformTestComponent {
  public mask = '';
  public maskOptions = {};
}

describe('MaskTransformDirective', () => {
  let fixture: ComponentFixture<MaskTransformTestComponent>;
  let component: MaskTransformTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaskTransformDirective, MaskTransformTestComponent],
      providers: [DecimalPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MaskTransformTestComponent);
        component = fixture.componentInstance;
      });
  });

  describe('when it is mask for NumberMaskInput', () => {
    beforeEach(() => {
      component.mask = 'NumberMaskInput';
    });

    it('mask transform directive should provide correct format after blur/change', () => {
      const input = fixture.debugElement.query(By.css('input'));
      const inputNative: HTMLInputElement = input.nativeElement;
      fixture.detectChanges();

      inputNative.value = 's1!2$3_1+2s3s';
      input.triggerEventHandler('change', { target: inputNative });
      fixture.detectChanges();
      expect(inputNative.value).toBe('123 123.00');
    });

    describe('when provided specific decimalSymbol', () => {
      beforeEach(() => {
        component.maskOptions = { decimalSymbol: ',' };
      });

      it('mask transform directive should provide correct format after blur/change', () => {
        const input = fixture.debugElement.query(By.css('input'));
        const inputNative: HTMLInputElement = input.nativeElement;
        fixture.detectChanges();

        inputNative.value = 's1!2$3_1+2s3s';
        input.triggerEventHandler('change', { target: inputNative });
        fixture.detectChanges();
        expect(inputNative.value).toBe('123 123,00');
      });
    });
  });
});
