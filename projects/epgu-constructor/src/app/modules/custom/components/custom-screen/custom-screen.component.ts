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
      [this.cycledValues] = [
        ...Object.values(currentCycledFields).map((value) => JSON.parse(value)),
      ];
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
      // take currentCycledFields object first key
      const [currentCycledFieldsKey] = Object.keys(
        this.constructorService.response?.scenarioDto?.currentCycledFields,
      );
      // format state data to {fieldName: value} format
      const stateDataPrepared = Object.keys(changes).reduce((result, key) => {
        const fieldName =
          changes[key].component.attrs.fields && changes[key].component.attrs.fields[0].fieldName;
        if (!fieldName) return result;

        if (typeof changes[key].value === 'object' && moment(changes[key].value).isValid()) {
          // eslint-disable-next-line no-param-reassign
          result[fieldName] = moment(changes[key].value).format(DATE_STRING_DOT_FORMAT);
        } else {
          // eslint-disable-next-line no-param-reassign
          result[fieldName] = changes[key].value;
        }
        return result;
      }, {});
      // flat cycledValues
      const cycledValuesPrepared = { ...this.cycledValues };
      // merge cycledValue data and state data, which could be updated
      const data = { ...cycledValuesPrepared, ...stateDataPrepared };
      stateData[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(data),
      };
    } else {
      stateData = this.getPrepareResponseData(changes);
    }

    return stateData;
  }

  changeComponentsList(changes) {
    const responseData = this.setState(changes);
    this.dataToSend = responseData;
  }

  private getPrepareResponseData(data = {}) {
    return Object.keys(data).reduce((acc, key) => {
      // if (!this.dataToSend[key].valid) return; // TODO: add user-friendly validation logic
      acc[key] = {
        visited: true,
        value:
          data[key].value !== 'object' ? data[key].value : JSON.stringify(data[key].value || {}),
      };
      return acc;
    }, {});
  }
}
