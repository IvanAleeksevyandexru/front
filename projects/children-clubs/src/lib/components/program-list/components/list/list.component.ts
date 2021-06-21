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
import { map } from 'rxjs/operators';
import { ProgramListService } from '../../program-list.service';

@Component({
  selector: 'children-clubs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Output() addItemsEvent = new EventEmitter<string>();

  loading$ = this.listService.loading$;
  isShowButton$ = this.listService.isFinish$.pipe(map((status) => !status));
  loadPercentScroll = 80;

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    private listService: ProgramListService,
  ) {}

  @HostListener('window:scroll', ['$event']) scroll(event: Event): void {
    const scrollElement: HTMLElement = (event.target as Document).scrollingElement as HTMLElement;
    if (
      !this.listService.autoScroll ||
      scrollElement.clientHeight === scrollElement.scrollHeight ||
      this.getScrollPosition(scrollElement) < this.loadPercentScroll ||
      this.listService.isFinish ||
      this.listService.fullLoading ||
      this.listService.loading
    ) {
      return;
    }
    this.addItemsEvent.emit();
  }

  getScrollPosition(element: HTMLElement): number {
    return Math.round(((element.scrollTop + element.offsetHeight) / element.scrollHeight) * 100);
  }

  next(): void {
    if (!this.listService.autoScroll) {
      this.listService.autoScroll = true;
    }
    this.addItemsEvent.emit();
  }
}
