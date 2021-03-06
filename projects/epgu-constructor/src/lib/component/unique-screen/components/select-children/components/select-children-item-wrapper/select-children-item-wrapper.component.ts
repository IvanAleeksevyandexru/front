import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { ScreenService } from '../../../../../../screen/screen.service';

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

  listLabel = this.screenService.component?.attrs?.listLabel ?? true;
  chooseChildLabel =
    this.screenService.component?.attrs?.chooseChildLabel ?? 'Выберите ребёнка из вашего профиля';
  constructor(private screenService: ScreenService) {}

  public removeChild(): void {
    this.removeChildEvent.emit(this.idx);
  }
}
