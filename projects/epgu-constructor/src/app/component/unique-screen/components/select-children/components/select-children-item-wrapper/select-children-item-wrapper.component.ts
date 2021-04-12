import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'epgu-constructor-select-children-item-wrapper',
  templateUrl: './select-children-item-wrapper.component.html',
  styleUrls: ['./select-children-item-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenItemWrapperComponent {
  @Input() idx: number;
  @Input() isMoreThanOneChild: boolean;
  @Input() isSingleChild?: boolean;
  @Output() removeChildEvent = new EventEmitter<number>();

  public removeChild(): void {
    this.removeChildEvent.emit(this.idx);
  }
}
