import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActionType, Clarifications } from '@epgu/epgu-constructor-types';
import { ActionToolsService } from '../../directives/action/action-tools.service';

@Component({
  selector: 'epgu-constructor-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputHtmlComponent implements AfterViewInit, OnDestroy {
  @Input() html: string;
  @Input() clarifications: Clarifications;
  @Input() componentId: string;
  @ViewChild('outputHtmlRef') outputHtmlRef: ElementRef;

  constructor(private actionTools: ActionToolsService) {}

  ngAfterViewInit(): void {
    // Для того чтобы не было проблем с копированием в буффер обмена на IOS подгружаем данные для буффера заранее
    const element = this.outputHtmlRef.nativeElement.querySelector(
      '[data-action-type]',
    ) as HTMLElement;
    const actionType = element?.getAttribute('data-action-type') as ActionType;
    if (actionType === ActionType.copyToClipboard) {
      element.setAttribute('data-notify', 'false');
      element.click();
      window.requestAnimationFrame(() => {
        element.setAttribute('data-notify', null);
      });
    }
  }

  ngOnDestroy(): void {
    this.actionTools.resetBuffer();
  }
}
