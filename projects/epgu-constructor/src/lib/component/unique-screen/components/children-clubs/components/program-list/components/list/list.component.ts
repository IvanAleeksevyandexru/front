import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { ProgramListService } from '../../../../services/program-list/program-list.service';

@Component({
  selector: 'epgu-constructor-cc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Output() addItemsEvent = new EventEmitter<string>();

  loading$ = this.programListService.loading$;
  isShowButton$ = this.programListService.isFinish$.pipe(map((status) => !status));

  loadPercentScroll = 80;

  constructor(private programListService: ProgramListService) {}

  @HostListener('window:scroll', ['$event']) scroll(event: Event): void {
    const scrollElement: HTMLElement = (event.target as Document).scrollingElement as HTMLElement;
    this.handleScroll(scrollElement);
  }

  handleScroll(scrollElement: HTMLElement): void {
    if (
      !this.programListService.autoScroll ||
      scrollElement.clientHeight === scrollElement.scrollHeight ||
      this.getScrollPosition(scrollElement) < this.loadPercentScroll ||
      this.programListService.isFinish ||
      this.programListService.fullLoading ||
      this.programListService.loading
    ) {
      return;
    }
    this.addItemsEvent.emit();
  }

  getScrollPosition(element: HTMLElement): number {
    return Math.round(((element.scrollTop + element.offsetHeight) / element.scrollHeight) * 100);
  }

  next(): void {
    if (!this.programListService.autoScroll) {
      this.programListService.autoScroll = true;
    }
    this.addItemsEvent.emit();
  }
}
