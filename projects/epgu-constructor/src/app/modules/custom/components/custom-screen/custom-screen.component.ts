import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class CustomScreenComponent {
  @Input() data: CustomDisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  dataToSend: any;

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextScreen() {
    const responseData = {};

    Object.keys(this.dataToSend).forEach((key) => {
      // if (!this.dataToSend[key].valid) return; // TODO: add user-friendly validation logic

      responseData[key] = {
        visited: true,
        value: JSON.stringify(this.dataToSend[key].value || {}),
      };
    });
    this.nextStepEvent.emit(responseData);
  }

  changeComponentsList(event) {
    this.dataToSend = event;
  }
}
