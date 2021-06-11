import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  HostListener,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'children-clubs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Output() addItemsEvent = new EventEmitter<string>();

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  @HostListener('window:scroll') scroll(): void {
    const isBottomPage =
      this.window.innerHeight + this.window.scrollY === this.document.body.scrollHeight;

    if (isBottomPage) {
      this.addItemsEvent.emit();
    }
  }
}
