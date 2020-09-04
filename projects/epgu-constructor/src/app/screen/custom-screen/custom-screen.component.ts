import { Component, OnInit } from '@angular/core';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { DATE_STRING_DOT_FORMAT } from '../../../constant/global';
import { Screen, ScreenData } from '../../../interfaces/screen.interface';
import { NextStepEventData } from '../../../interfaces/step-event-data.interface';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { ScreenService } from '../screen.service';

const moment = moment_;
@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class CustomScreenComponent implements OnInit, Screen {
  dataToSend: any;
  isCycledFields: boolean;
  cycledValues: any;
  screenData: ScreenData;

  private currentCycledFields = this.screenData?.currentCycledFields || {};
  private cycledFieldsKeys = Object.keys(this.currentCycledFields);

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnChanges(changes) {
    // covers 'navigation' between two custom-screens and its initial data loading
    const {
      data: { firstChange, currentValue, previousValue },
    } = changes;
    if (firstChange || currentValue.id !== previousValue.id) {
      this.initCycledFields();
    }
  }

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
        this.initCycledFields();
      });
  }

  initCycledFields() {
    this.currentCycledFields = this.screenData?.currentCycledFields || {};
    this.cycledFieldsKeys = Object.keys(this.currentCycledFields);

    const { currentCycledFields } = this;
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields) {
      const [firstCurrentCycledValues] = Object.values(currentCycledFields);
      this.cycledValues = JSON.parse(firstCurrentCycledValues);
      this.screenData.componentData.components.forEach((item) => {
        const fieldName = item.attrs?.fields && item.attrs?.fields[0].fieldName;
        const cycledFieldKey = Object.keys(this.cycledValues).find((key) => key === fieldName);
        // eslint-disable-next-line no-param-reassign
        item.value = this.cycledValues[cycledFieldKey];
      });
    }
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(data?: NextStepEventData): void {
    this.navigationService.nextStep.next(data);
  }

  nextScreen(): void {
    const data = this.dataToSend;
    this.nextStep({ data });
  }

  getFormattedData(changes) {
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

  changeComponentsList(changes): void {
    this.dataToSend = this.getFormattedData(changes);
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
      const targetComponent = this.screenData.componentData.components.find(
        (item) => item.id === key,
      );
      const fieldName = targetComponent.attrs.fields && targetComponent.attrs.fields[0].fieldName;
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
