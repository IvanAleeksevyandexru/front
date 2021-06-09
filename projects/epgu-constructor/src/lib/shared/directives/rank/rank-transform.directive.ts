import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgControl } from '@angular/forms';
import { isEmpty as _isEmpty } from 'lodash';

@Directive({
  selector: '[epgu-constructor-rank-transform]'
})
export class RankTransformDirective implements OnInit{
  @Input('epgu-constructor-rank-transform') rank: boolean;

  constructor(
    private decimalPipe: DecimalPipe,
    private ngControl: NgControl,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    if (this.rank) {
      return event.key != ' ' && (event.key >= '0' && event.key <= '9');
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    if (this.rank) {
      const value = target.value.replace(/[^\d]|^0/g, '');
      this.renderer.setProperty(target, 'value', value);
    }
  }

  @HostListener('change', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    if (this.rank) {
      let value = target.value || '0';
      if (!Number.isNaN(+value)) {
        this.renderer.setProperty(target, 'value', this.normalizeDecimal(value));
        this.ngControl.control.setValue(value.replace(/\s+/g, ''), { emitModelToViewChange: false });
      }
    }
  }

  ngOnInit(): void {
    const { value } = this.ngControl.control;
    if(!_isEmpty(value) && this.rank) {
      const inputEl = this.elRef.nativeElement.querySelector('input');
      this.renderer.setProperty(inputEl, 'value', this.normalizeDecimal(value));
    }
  }

  private normalizeDecimal(value: string): string {
    return this.decimalPipe.transform(value.substring(0, 10), '0.0-0');
  }
}
