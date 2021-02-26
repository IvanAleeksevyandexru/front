import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'epgu-constructor-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input() label: string;
  @Input() id?: string | number;
  @Output() closeEvent = new EventEmitter<string | number>();

  onClose(): void {
    this.closeEvent.emit(this.id || this.label);
  }
}
