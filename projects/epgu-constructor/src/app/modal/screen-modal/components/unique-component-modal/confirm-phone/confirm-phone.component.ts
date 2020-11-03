import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationOptions, NavigationPayload } from '../../../../../form-player/form-player.types';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';

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
  count = 59;
  countInterval = 1000;

  characterMask: string;
  codeLength: number;

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navModalService: NavigationModalService,
    private fb: FormBuilder,
  ) {
    this.characterMask = this.screenService.component.attrs.characterMask;
    this.codeLength = this.screenService.component.attrs.codeLength;
    this.mask = new Array(this.codeLength).fill(new RegExp(this.characterMask));
  }

  ngOnInit(): void {
    this.initCodeFormArray();
  }

  sendCodeAgain() {
    const url = this.screenService.component.attrs.resendCodeUrl;
    const options: NavigationOptions = { url };
    this.navModalService.next({ options });
    this.isTimerShow = true;
  }

  enterCode(code: any) {
    if (String(code).length === this.codeLength) {
      this.navModalService.next({ payload: this.getComponentState(code) });
    }
  }

  getComponentState(code: any): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(code),
      },
    };
  }

  timerChange(num: number) {
    if (num) {
      this.timer = num;
    } else {
      this.isTimerShow = false;
    }
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
          const code: any = this.codeFormArray
            .getRawValue()
            .map((elem: CodeFormGroup) => elem.codeValue)
            .join('');

          if (next.codeValue) {
            this.navigateToControl(next);
          }

          this.enterCode(code);
        });
    }
  }

  private getInput(element: HTMLElement): HTMLElement {
    return element.getElementsByTagName('input')[0];
  }

  private focusToElement(element: HTMLElement): void {
    setTimeout(() => element.focus(), 0);
  }

  private navigateToControl(obj: CodeFormGroup): void {
    const isLastIndex: boolean = this.codeLength - 1 === obj.codeIndexElement;
    const nextIndex: number = isLastIndex ? obj.codeIndexElement : obj.codeIndexElement + 1;
    const input: HTMLElement = this.getInput(
      this.codeGroupElement.nativeElement.children[nextIndex],
    );

    this.focusToElement(input);
  }
}
