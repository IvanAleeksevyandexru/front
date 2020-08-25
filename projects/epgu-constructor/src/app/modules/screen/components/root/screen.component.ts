import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';

interface ComponentSetting {
  displayContinueBtn: boolean;
  displayWarningAnswers: boolean;
}

@Component({
  selector: 'epgu-constructor-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
  providers: [UnsubscribeService],
})
export class ScreenComponent implements OnInit {
  componentSetting: ComponentSetting = {
    displayContinueBtn: true,
    displayWarningAnswers: false,
  };
  // <-- constant
  screenComponentName = SCREEN_COMPONENT_NAME;

  // <-- variables
  componentData = null;
  form: FormGroup;

  @Input() data: DisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    public constructorService: ConstructorService,
    private navService: NavigationService,
    public screenComponentService: ScreenComponentService,
    private ngUnsubscribe$: UnsubscribeService,
    private fb: FormBuilder,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
  }

  prevStep(): void {
    this.prevStepEvent.emit();
  }

  nextStep() {
    const data =
      typeof this.screenComponentService.dataToSend === 'object'
        ? JSON.stringify(this.screenComponentService.dataToSend)
        : this.screenComponentService.dataToSend;
    this.nextStepEvent.emit(data);
  }

  changeComponentData(value: any): void {
    this.componentData = value;
  }

  changeComponentSettings(settings: ComponentSetting): void {
    this.componentSetting = { ...this.componentSetting, ...settings };
  }

  goToHomePage(): void {
    // TODO: navigate to Home Page
  }
}
