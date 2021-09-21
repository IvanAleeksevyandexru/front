import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, NgControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { BaseUiModule } from '../../base-ui.module';

@Component({
  selector: 'epgu-cf-ui-rank-transform-test-component',
  template: ' <input type="text" [epgu-cf-ui-rank-transform]="true" [formControl]="control" />',
})
class RankTransformTestComponent {
  control = new FormControl('');
}

describe('RankTransformDirective', () => {
  let fixture: ComponentFixture<RankTransformTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RankTransformTestComponent],
      imports: [RouterTestingModule, BaseUiModule],
      providers: [DecimalPipe, NgControl],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankTransformTestComponent);
  });

  it('test rank transform directive', () => {
    const input = fixture.debugElement.query(By.css('input'));
    const inputNative: HTMLInputElement = input.nativeElement;
    fixture.detectChanges();

    inputNative.value = 's1!2$3_1+2s3s';
    input.triggerEventHandler('input', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('123123');

    input.triggerEventHandler('change', { target: inputNative });
    fixture.detectChanges();
    expect(inputNative.value).toBe('123\u00a0123');
  });
});
