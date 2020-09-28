import { Component, Input, OnInit } from '@angular/core';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { ToolsService } from '../../../../shared/services/tools/tools.service';
import { TextTransform } from '../../../../shared/types/textTransform';
import { ComponentBase } from '../../../screen.types';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
})
export class AddPassportComponent implements OnInit {
  @Input() data: ComponentBase;
  @Input() currentCycledFields: object = {};

  isCycledFields: boolean;
  cycledValues: any;

  constructor(
    private componentStateService: ComponentStateService,
    private toolsService: ToolsService,
  ) {}

  ngOnInit(): void {
    this.isCycledFields = Boolean(Object.keys(this.currentCycledFields).length);
    if (this.isCycledFields) {
      [this.cycledValues] = [
        ...Object.values(this.currentCycledFields).map((value) => JSON.parse(value)),
      ];
      // format state data to {fieldName: value} format
      const data = this.data.attrs.fields.reduce((result, item) => {
        const { fieldName } = item;
        if (!fieldName) return result;

        // eslint-disable-next-line no-param-reassign
        result[fieldName] = this.cycledValues[fieldName];
        return result;
      }, {});
      this.data.value = JSON.stringify(data);
    }
  }

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }

  onPassportDataChange(data) {
    let stateData: any;
    if (this.isCycledFields) {
      stateData = this.toolsService.getFormattedCycledValues(
        data,
        this.currentCycledFields,
        this.cycledValues,
      );
    } else {
      stateData = data;
    }

    this.componentStateService.state = stateData;
  }
}
