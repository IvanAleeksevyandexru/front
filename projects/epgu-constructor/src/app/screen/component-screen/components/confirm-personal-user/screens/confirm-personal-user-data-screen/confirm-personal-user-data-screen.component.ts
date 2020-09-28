import { Component, Input, OnInit } from '@angular/core';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ToolsService } from '../../../../../../shared/services/tools/tools.service';
import { ConfirmUserData } from '../../../../types/confirm-user-data.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss'],
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  constructor(
    private currentAnswersService: CurrentAnswersService,
    private toolsService: ToolsService,
  ) {}

  propData: ConfirmUserData;
  @Input() set data(val: ConfirmUserData) {
    this.propData = val;
    const { value } = val;
    this.currentAnswersService.state = value;
  }
  @Input() errors: object;
  @Input() currentCycledFields: object = {};
  @Input() applicantAnswers: object = {};

  isCycledFields: boolean;
  cycledValues: any;

  ngOnInit(): void {
    this.isCycledFields = !!Object.keys(this.currentCycledFields).length;
    if (this.isCycledFields) {
      [this.cycledValues] = [
        ...Object.values(this.currentCycledFields).map((value) => JSON.parse(value)),
      ];
      // format state data to {fieldName: value} format
      const data = this.propData.attrs.fields.reduce((result, item) => {
        const { fieldName } = item;
        if (!fieldName) return result;

        // eslint-disable-next-line no-param-reassign
        result[fieldName] = this.cycledValues[fieldName];
        return result;
      }, {});
      const changes = this.cycledValues;
      const value = this.toolsService.getFormattedCycledValues(
        changes,
        this.currentCycledFields,
        this.cycledValues,
      );

      this.propData.value = JSON.stringify(data);
      this.currentAnswersService.state = value;
    }
  }

  clickToAction(action): void {
    console.log('click to action: ', action);
  }
}
