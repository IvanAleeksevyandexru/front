import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { TextTransform } from '../../../../../../shared/types/textTransform';
import { ComponentBase } from '../../../../../screen.types';

@Component({
  selector: 'epgu-constructor-add-new-child-form',
  templateUrl: './add-new-child-form.component.html',
  styleUrls: ['./add-new-child-form.component.scss'],
})
export class AddNewChildFormComponent implements AfterViewInit {
  @ViewChild('newChildForm') newChildForm;

  @Input() data: ComponentBase;
  @Input() item: any;
  @Output() childUpdateEvent = new EventEmitter();

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

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

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }
}
