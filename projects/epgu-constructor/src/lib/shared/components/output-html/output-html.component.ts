import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ActionType, Clarifications } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputHtmlComponent implements AfterViewInit {
  @Input() html: string;
  @Input() clarifications: Clarifications;
  @Input() componentId: string;
  @ViewChild('outputHtmlRef') outputHtmlRef: ElementRef;

  ngAfterViewInit(): void {
    // Для того чтобы не было проблем с копированием в буффер обмена на IOS подгружаем данные для буффера заранее
    const element = this.outputHtmlRef.nativeElement.querySelector(
      '[data-action-type]',
    ) as HTMLElement;
    const actionType = element?.getAttribute('data-action-type') as ActionType;
    if (actionType === ActionType.copyToClipboard) {
      element.click();
    }
  }
}
