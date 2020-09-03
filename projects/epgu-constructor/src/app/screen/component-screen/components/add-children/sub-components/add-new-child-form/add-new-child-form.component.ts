import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../../constant/global';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-add-new-child-form',
  templateUrl: './add-new-child-form.component.html',
  styleUrls: ['./add-new-child-form.component.scss'],
})
export class AddNewChildFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('newChildForm') newChildForm;

  @Input() data: any;
  @Output() removeChildEvent = new EventEmitter();
  @Output() childUpdateEvent = new EventEmitter();

  item: any;
  items: any;
  itemsToSelect: Array<ListItem>;
  list: Array<ListItem>;

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  handleSelect(event) {
    const { id } = event;
    this.item = {
      ...this.item,
      ...this.items.find((child) => child.id === id),
      id: this.item.id,
    };
  }

  removeChild(id) {
    this.removeChildEvent.emit(id);
  }

  ngOnInit(): void {
    this.items = this.data.items.map((item) => {
      const itemFormatted = item;
      if (typeof item.birthDate === 'string') {
        itemFormatted.birthDate = moment(itemFormatted.birthDate, DATE_STRING_DOT_FORMAT).toDate();
      }
      return itemFormatted;
    });
    this.itemsToSelect = this.data.itemsToSelect;
    this.item = this.data.item;
  }

  ngAfterViewInit() {
    this.newChildForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
      const { birthDate, firstName, lastName, middleName, gender } = change;
      this.item.birthDate = birthDate;
      this.item.firstName = firstName;
      this.item.lastName = lastName;
      this.item.middleName = middleName;
      this.item.gender = gender;
      this.childUpdateEvent.emit(this.item);
    });
  }

  ngOnDestroy() {
    this.item.birthDate = moment(this.item.birthDate).format(DATE_STRING_DOT_FORMAT);
    this.childUpdateEvent.emit(this.item);
  }
}
