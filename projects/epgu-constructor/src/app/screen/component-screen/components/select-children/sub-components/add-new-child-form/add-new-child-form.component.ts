import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
// import { NavigationPayload } from '../../../../../../form-player.types';
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

  @Input() componentData: ComponentBase;
  @Input() item: any;
  @Output() childUpdateEvent = new EventEmitter();
  dataToSend: any;
  isValid: boolean;

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  changeComponentsList(changes: { [key: string]: any }): void {
    this.isValid = Object.values(changes).every((item) => item.valid);
    this.dataToSend = this.getFormattedData(changes);
  }

  getFormattedData(changes: SimpleChanges) {
    console.log({ changes });
  }

  ngAfterViewInit() {
    // this.newChildForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
    //   const { birthDate, firstName, lastName, middleName, gender } = change;
    //   this.item.birthDate = birthDate;
    //   this.item.firstName = firstName;
    //   this.item.lastName = lastName;
    //   this.item.middleName = middleName;
    //   this.item.gender = gender;
    //   this.childUpdateEvent.emit(this.item);
    // });
  }

  get textTransformType(): TextTransform {
    return this.componentData?.attrs?.fstuc;
  }
}
