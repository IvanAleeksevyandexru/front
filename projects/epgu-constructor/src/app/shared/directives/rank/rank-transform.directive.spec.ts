import { RankTransformDirective } from './rank-transform.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, NgControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseModule } from '../../base.module';
import { configureTestSuite } from 'ng-bullet';

@Component({
  selector: 'epgu-constructor-rank-transform-test-component',
  template: `
    <input
      type="text"
      [epgu-constructor-rank-transform]="true"
      [formControl]="control"
    />`,
})
class RankTransformTestComponent {
  control =  new FormControl('');
}

describe('RankTransformDirective', () => {
  let fixture: ComponentFixture<RankTransformTestComponent>;
  let comp: RankTransformTestComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RankTransformDirective, RankTransformTestComponent],
      imports: [RouterTestingModule, BaseModule],
      providers: [DecimalPipe, NgControl],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankTransformTestComponent);
    comp = fixture.componentInstance;
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
