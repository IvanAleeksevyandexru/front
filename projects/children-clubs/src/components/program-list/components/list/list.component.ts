import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { List } from '../../program-list.models';

@Component({
  selector: 'children-clubs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnChanges {
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  @Input() list: List;
  @Output() addItemsEvent = new EventEmitter<string>();
  public scrollConfig: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false,
    // minScrollbarLength: 300,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.list.firstChange) {
      this.perfectScroll.directiveRef.update();
    }
  }
}
