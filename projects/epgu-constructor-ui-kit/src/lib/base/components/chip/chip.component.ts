import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'epgu-cf-ui-constructor-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input() label: string;
  @Input() id?: string | number;
  @Input() unselectable?: boolean;
  @Output() closeEvent = new EventEmitter<string | number>();

  onClose(): void {
    this.closeEvent.emit(this.id || this.label);
  }
}
