import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationOptions, NavigationPayload } from '../../../../../form-player/form-player.types';
import { EventBusService } from '../../../../../form-player/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../../screen/screen.service';

interface CodeFormGroup {
  codeMask: Array<RegExp>;
  codeValue: string | number;
  codeIndexElement: number;
}

@Component({
  selector: 'epgu-constructor-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPhoneComponent implements OnInit {
  @ViewChild('codeGroup') codeGroupElement: ElementRef;
  // <-- variable
  enteredCode: number;
  timer: number;
  isTimerShow = true;

  codeFormArray = new FormArray([]);

  // <-- constant
  correctCodeLength = 4;
  mask = [/\d/, /\d/, /\d/, /\d/];
  count = 89;
  countInterval = 1000;

  characterMask: string;
  codeLength: number;
  lastCode: string;

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navModalService: NavigationModalService,
    private fb: FormBuilder,
    private eventBusService: EventBusService,
  ) {
    this.characterMask = this.screenService.component.attrs.characterMask;
    this.codeLength = this.screenService.component.attrs.codeLength;
    this.mask = new Array(this.codeLength).fill(new RegExp(this.characterMask));
  }

  ngOnInit(): void {
    this.initCodeFormArray();
    this.eventBusService
      .on('counterValueChanged')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: number) => this.timerChange(payload));
  }

  isItemHasError(codeValue: string): Boolean {
    return Boolean(this.screenService.componentError && codeValue);
  }

  sendCodeAgain(): void {
    const url = this.screenService.component.attrs.resendCodeUrl;
    const options: NavigationOptions = { url };
    this.navModalService.next({ options });
    this.isTimerShow = true;
  }

  enterCode(code: string): void {
    if (String(code).length === this.codeLength && this.lastCode !== code) {
      this.navModalService.next({ payload: this.getComponentState(code) });
    }
  }

  editNumber(): void {
    this.navModalService.prev({});
  }

  timerChange(num: number): void {
    if (num) {
      this.timer = num;
    } else {
      this.isTimerShow = false;
    }
  }

  focusToElement(element: HTMLElement): void {
    setTimeout(() => element.focus(), 0);
  }

  focusIndex(nextIndex: number): void {
    if (!this.codeFormArray.value[nextIndex]?.codeValue) {
      const input: HTMLElement = this.getInput(
        this.codeGroupElement.nativeElement.children[nextIndex],
      );
      this.focusToElement(input);
    }
  }

  private getComponentState(code: string | number): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(code),
      },
    };
  }

  private initCodeFormArray(): void {
    for (let i = 0; i < this.codeLength; i += 1) {
      const codeFormGroup: FormGroup = this.fb.group({
        codeMask: [new Array(1).fill(this.mask[i])],
        codeValue: [null],
        codeIndexElement: [i],
      });
      this.codeFormArray.push(codeFormGroup);

      codeFormGroup.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((next: CodeFormGroup) => {
          const code = this.codeFormArray
            .getRawValue()
            .map((elem: CodeFormGroup) => elem.codeValue)
            .join('');

          if (next.codeValue) {
            this.navigateToControl(next);
          }

          this.enterCode(code);
          this.lastCode = code;
        });
    }
  }

  private getInput(element: HTMLElement): HTMLElement {
    return element.getElementsByTagName('input')[0];
  }

  private navigateToControl(obj: CodeFormGroup): void {
    const isLastIndex: boolean = this.codeLength - 1 === obj.codeIndexElement;
    const nextIndex: number = isLastIndex ? obj.codeIndexElement : obj.codeIndexElement + 1;
    this.focusIndex(nextIndex);
  }
}
