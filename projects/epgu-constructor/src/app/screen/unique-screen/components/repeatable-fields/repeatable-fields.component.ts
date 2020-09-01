import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormPlayerService } from '../../../../services/form-player/form-player.service';

@Component({
  selector: 'epgu-constructor-repeatable-fields',
  templateUrl: './repeatable-fields.component.html',
  styleUrls: ['./repeatable-fields.component.scss'],
  providers: [FormPlayerService],
})
export class RepeatableFieldsComponent implements OnInit {
  components = []; // TODO указать тип

  propData; // TODO указать тип
  screens = []; // TODO указать тип
  screenData = []; // TODO указать тип
  get data() {
    return this.propData;
  }
  @Input() set data(data) {
    this.propData = data;
    this.screens.push(data.components[0].attrs.components);
  }
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(public constructorService: FormPlayerService) {}

  ngOnInit(): void {}

  duplicateScreen() {
    this.screens.push(this.data.components[0].attrs.components);
  }

  changeComponentsList(state, index) {
    this.screenData[index] = state;
    console.log(state, index, this.screenData);
  }

  nextScreen() {
    const responseData = {};
    const dataToSend = [...this.screenData];

    Object.keys(dataToSend).forEach((key) => {
      // if (!dataToSend[key].valid) return; // TODO: add user-friendly validation logic

      responseData[key] = {
        visited: true,
        value: JSON.stringify(dataToSend[key] || {}),
      };
    });
    this.nextStepEvent.emit(responseData);
  }
}
