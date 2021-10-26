import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { FormControl, NgControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';

import { CoreUiModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../base.module';
import { CoreModule } from '../../../core/core.module';
import { MaskTransformDirective } from './mask-transform.directive';
import { MaskTransformService } from '../../services/mask-transform/mask-transform.service';

@Component({
  selector: 'epgu-constructor-mask-transform-test-component',
  template: ` <input
    type="text"
    [epgu-constructor-mask-transform]="mask"
    [maskOptions]="maskOptions"
    [formControl]="control"
  />`,
})
class MaskTransformTestComponent {
  public mask = '';
  public maskOptions = {};
  control = new FormControl({ value: '' });
}

describe('MaskTransformDirective', () => {
  let component: MaskTransformTestComponent;
  let fixture: ComponentFixture<MaskTransformTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MaskTransformDirective, MaskTransformTestComponent],
      imports: [CoreModule, MockModule(CoreUiModule), BaseModule],
      providers: [
        DecimalPipe,
        NgControl,
        MaskTransformService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskTransformTestComponent);
    component = fixture.componentInstance;
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
