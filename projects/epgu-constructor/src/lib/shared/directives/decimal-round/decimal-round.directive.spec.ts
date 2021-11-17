import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { FormControl, NgControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { CoreUiModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../base.module';
import { CoreModule } from '../../../core/core.module';
import { DecimalRoundDirective } from './decimal-round.directive';
import { MaskTransformService } from '../../services/mask-transform/mask-transform.service';

@Component({
  selector: 'epgu-constructor-decimal-round-test-component',
  template: ` <input
    type="text"
    [epgu-constructor-decimal-round]="mask"
    [maskOptions]="maskOptions"
    [formControl]="control"
  />`,
})
class DecimalRoundTestComponent {
  public mask = '';
  public maskOptions = {};
  control = new FormControl({ value: '' });
}

describe('DecimalRoundDirective', () => {
  let component: DecimalRoundTestComponent;
  let fixture: ComponentFixture<DecimalRoundTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecimalRoundDirective, DecimalRoundTestComponent],
      imports: [CoreModule, MockModule(CoreUiModule), BaseModule],
      providers: [
        DecimalPipe,
        NgControl,
        MaskTransformService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecimalRoundTestComponent);
    component = fixture.componentInstance;
  });

  describe('when "allowDecimalRounding" is true and "mask" property equal "NumberMaskInput"', () => {
    it('should round last allowable number symbols on paste event when rounding enabled', () => {
      component.mask = 'NumberMaskInput';
      component.maskOptions = {
        allowDecimalRounding: true,
        decimalLimit: 2,
      };

      const input = fixture.debugElement.query(By.css('input'));
      const inputNative: HTMLInputElement = input.nativeElement;

      fixture.detectChanges();

      input.triggerEventHandler('paste', {
        target: inputNative,
        clipboardData: {
          getData: () => {
            return '1.149234';
          }
        },
        // eslint-disable-next-line no-empty-function
        preventDefault: () => {},
      });
      fixture.detectChanges();
      expect(inputNative.value).toBe('1.15');
    });
  });
});
