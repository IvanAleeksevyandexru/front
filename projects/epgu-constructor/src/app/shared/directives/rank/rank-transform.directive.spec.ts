import { RankTransformDirective } from './rank-transform.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'epgu-constructor-rank-transform-test-component',
  template: ' <input type="text" [epgu-constructor-rank-transform]="true" /> ',
})
class RankTransformTestComponent {}

describe('RankTransformDirective', () => {
  let fixture: ComponentFixture<RankTransformTestComponent>;
  let comp: RankTransformTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankTransformDirective, RankTransformTestComponent],
      providers: [DecimalPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RankTransformTestComponent);
        comp = fixture.componentInstance;
      });
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
    expect(inputNative.value).toBe('123,123');
  });
});
