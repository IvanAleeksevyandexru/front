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
import { delay, takeUntil } from 'rxjs/operators';
import { CONSTANTS } from '../../../../../../../constant/global';
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

  child: any;
  childrenList: any;
  childrenSelectList: Array<ListItem>;
  list: Array<ListItem>;

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  handleSelect(event) {
    const { id } = event;
    this.child = {
      ...this.child,
      ...this.childrenList.find((child) => child.id === id),
      id: this.child.id,
    };
  }

  removeChild(id) {
    this.removeChildEvent.emit(id);
  }

  ngOnInit(): void {
    this.childrenList = this.data.childrenList.map((child) => {
      const childFormatted = child;
      if (typeof child.birthDate === 'string') {
        childFormatted.birthDate = moment(childFormatted.birthDate, CONSTANTS.dateFormat).toDate();
      }
      return childFormatted;
    });
    this.childrenSelectList = this.data.childrenSelectList;
    this.child = this.data.child;
  }

  ngAfterViewInit() {
    this.newChildForm.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), delay(0))
      .subscribe((change) => {
        const { birthDate, firstName, lastName, middleName, gender } = change;
        this.child.birthDate = birthDate;
        this.child.firstName = firstName;
        this.child.lastName = lastName;
        this.child.middleName = middleName;
        this.child.gender = gender;
        this.childUpdateEvent.emit(this.child);
      });
  }

  ngOnDestroy() {
    this.child.birthDate = moment(this.child.birthDate).format(CONSTANTS.dateFormat);
    this.childUpdateEvent.emit(this.child);
  }
}
