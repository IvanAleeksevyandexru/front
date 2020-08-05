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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  index: number;
  ngUnsubscribe$: Subject<void>;

  constructor() {
    this.ngUnsubscribe$ = new Subject();
  }

  handleSelect(event) {
    const { item } = event;
    this.child = {
      ...this.child,
      ...this.childrenList.find((child) => child.firstName === item.id),
    };
  }

  removeChild(index) {
    this.removeChildEvent.emit(index);
  }

  ngOnInit(): void {
    this.childrenList = this.data.childrenList.map((child) => {
      const childFormatted = child;
      if (typeof child.birthDate === 'string') {
        childFormatted.birthDate = new Date(child.birthDate.split('.').reverse().join('.'));
      }
      return childFormatted;
    });
    this.childrenSelectList = this.data.childrenSelectList;
    this.child = this.data.child;
    this.index = this.data.index;
  }

  ngAfterViewInit() {
    this.newChildForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
      const { birthDate, firstName, lastName, middleName, gender } = change;
      this.child.birthDate = birthDate;
      this.child.firstName = firstName;
      this.child.lastName = lastName;
      this.child.middleName = middleName;
      this.child.gender = gender;
      this.childUpdateEvent.emit({ childData: this.child, childIdx: this.index });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
