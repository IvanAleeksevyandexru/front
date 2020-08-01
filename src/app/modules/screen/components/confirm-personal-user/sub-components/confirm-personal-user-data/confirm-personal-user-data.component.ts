import { Component, OnInit, Input } from '@angular/core';
import { ConfirmUserDataInterface } from '../../../../../../interfaces/confirm-user-data.interface';

@Component({
  selector: 'app-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
})
export class ConfirmPersonalUserDataComponent implements OnInit {
  @Input() data: ConfirmUserDataInterface;
  templateData: any = {};
  constructor() {}

  ngOnInit(): void {
    try {
      this.templateData.valueOrigin = this.data.value;
      this.templateData.valueParsed = JSON.parse(this.data.value);
    } catch (err) {
      console.error(err);
    }
  }
}
