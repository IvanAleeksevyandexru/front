import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ListItem } from 'epgu-lib';
/* eslint-disable import/no-extraneous-dependencies */
import { Subject } from 'rxjs';
/* eslint-disable import/no-extraneous-dependencies */
import { takeUntil, delay } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-add-new-child-form',
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
  ngUnsubscribe$: Subject<void>;

  constructor() {
    this.ngUnsubscribe$ = new Subject();
  }

  handleSelect(event) {
    const { item } = event;
    this.child = {
      ...this.child,
      ...this.childrenList.find((child) => child.id === item.id),
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
        childFormatted.birthDate = moment(childFormatted.birthDate, 'DD.MM.YYYY').toDate();
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
    this.child.birthDate = moment(this.child.birthDate).format('DD.MM.YYYY');
    this.childUpdateEvent.emit(this.child);
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
