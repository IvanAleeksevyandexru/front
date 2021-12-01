import { Directive, OnChanges, Input, HostBinding, ElementRef, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[epgu-cf-ui-smooth-height]',
  host: { '[style.display]': '"block"', '[style.overflow]': '"hidden"' }
})
export class SmoothHeightAnimationDirective implements OnChanges {
  @Input() smoothHeight;
  @Input() lockAnimation;
  pulse: boolean;
  startHeight: number;

  constructor(private element: ElementRef) {}

  @HostBinding('@grow')
  get grow(): unknown {
    return { value: this.pulse, params: { startHeight: this.startHeight }};
  }

  setStartHeight(): void {
    this.startHeight = this.element.nativeElement.clientHeight;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if ('smoothHeight' in _changes && (!_changes.lockAnimation || !_changes.lockAnimation.currentValue)) {
      this.setStartHeight();
      this.pulse = !this.pulse;
    }

  }
}
