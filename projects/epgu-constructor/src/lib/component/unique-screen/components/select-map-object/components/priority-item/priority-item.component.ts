import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { PriorityItemsService } from '../../services/priority-items/priority-items.service';

@Component({
  selector: 'epgu-constructor-priority-item',
  templateUrl: './priority-item.component.html',
  styleUrls: ['./priority-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityItemComponent {
  @Input() data: DictionaryItem;
  @Input() index: number;
  @Input() isUp: boolean;
  @Input() isDown: boolean;
  @Input() disabled: boolean;

  @Output() delete = new EventEmitter<DictionaryItem>();
  @Output() up = new EventEmitter<number>();
  @Output() down = new EventEmitter<number>();
  @Output() showMap = new EventEmitter<DictionaryItem>();

  isShowDetails = false;
  arrowPath = `${this.config.staticDomainAssetsPath}/assets/icons/svg/arrow-down-white.svg`;

  maxKindergarten$ = this.itemsService.maxKindergarten$;

  constructor(public itemsService: PriorityItemsService, public config: ConfigService) {}

  toggleShowDetails(): void {
    this.isShowDetails = !this.isShowDetails;
  }

  deleteAction(): void {
    this.delete.emit(this.data);
  }

  upAction(): void {
    this.up.emit(this.index - 1);
  }

  downAction(): void {
    this.down.emit(this.index - 1);
  }

  showAction(): void {
    this.showMap.emit(this.data);
  }
}
