import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { DATE_STRING_DOT_FORMAT } from '../../../../../constant/global';
import { CustomDisplayInterface } from '../../../../../interfaces/custom-component.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';

const moment = moment_;
@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class CustomScreenComponent implements OnInit {
  @Input() data: CustomDisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  dataToSend: any;
  isCycledFields: boolean;
  cycledValues: any;

  private readonly cycledFieldsKeys = Object.keys(
    this.constructorService.response?.scenarioDto?.currentCycledFields,
  );

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnInit() {
    const currentCycledFields = this.constructorService.response?.scenarioDto?.currentCycledFields;
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields) {
      const [firstCurrentCycledValues] = Object.values(currentCycledFields);
      this.cycledValues = JSON.parse(firstCurrentCycledValues);
      this.data.components.forEach((item) => {
        const fieldName = item.attrs?.fields && item.attrs?.fields[0].fieldName;
        const cycledFieldKey = Object.keys(this.cycledValues).find((key) => key === fieldName);
        // eslint-disable-next-line no-param-reassign
        item.value = this.cycledValues[cycledFieldKey];
      });
    }
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextScreen() {
    const responseData = this.getPrepareResponseData(this.dataToSend);
    this.nextStepEvent.emit(responseData);
  }

  setState(changes) {
    let stateData = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const stateDataPrepared = this.formatCycledFieldsValues(changes);
      const cycledValuesPrepared = { ...this.cycledValues };
      const mergedCycledAndStateData = { ...cycledValuesPrepared, ...stateDataPrepared };
      stateData[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(mergedCycledAndStateData),
      };
    } else {
      stateData = this.getPrepareResponseData(changes);
    }

    return stateData;
  }

  changeComponentsList(changes) {
    this.dataToSend = this.setState(changes);
  }

  private getPrepareResponseData(data = {}) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = {
        visited: true,
        value:
          typeof data[key].value !== 'object'
            ? data[key].value
            : JSON.stringify(data[key].value || {}),
      };
      return acc;
    }, {});
  }

  private formatCycledFieldsValues(changes: any) {
    return Object.keys(changes).reduce((result, key) => {
      const targetItem = changes[key];
      const targetItemValue = targetItem.value;
      const fieldName =
        targetItem.component.attrs.fields && targetItem.component.attrs.fields[0].fieldName;
      if (!fieldName) return result;

      if (typeof targetItemValue === 'object' && moment(targetItemValue).isValid()) {
        // eslint-disable-next-line no-param-reassign
        result[fieldName] = moment(targetItemValue).format(DATE_STRING_DOT_FORMAT);
      } else {
        // eslint-disable-next-line no-param-reassign
        result[fieldName] = targetItemValue;
      }
      return result;
    }, {});
  }
}
