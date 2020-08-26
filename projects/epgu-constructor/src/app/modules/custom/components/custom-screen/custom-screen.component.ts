import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CustomDisplayInterface } from '../../../../../interfaces/custom-component.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';

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
    const cycledFields = this.constructorService.response?.scenarioDto?.cycledFields;
    this.isCycledFields = !!Object.keys(cycledFields).length;
    if (this.isCycledFields && typeof cycledFields === 'object') {
      this.cycledValues = [...Object.values(cycledFields).map((value) => JSON.parse(value))];
    }
    // this.setState();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextScreen() {
    const responseData = this.getPrepareResponseData(this.dataToSend);
    this.nextStepEvent.emit(responseData);
  }

  changeComponentsList(event) {
    this.dataToSend = event;
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
