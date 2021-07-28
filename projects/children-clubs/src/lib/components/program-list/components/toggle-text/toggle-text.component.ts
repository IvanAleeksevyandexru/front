import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { WINDOW } from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'children-clubs-toggle-text',
  templateUrl: './toggle-text.component.html',
  styleUrls: ['./toggle-text.component.scss'],
})
export class ToggleTextComponent implements OnInit, OnChanges {
  @Input() text = '';
  @Input() linesQuantity = 1;

  truncatedText = '';
  showAllText = false;
  elem: HTMLElement;
  lineHeight: number;

  constructor(@Inject(WINDOW) private window: Window, private elemRef: ElementRef) {}

  @HostListener('window:resize')
  onResize(): void {
    this.truncatedText = this.truncateText(this.text, this.linesQuantity);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.truncatedText = this.truncateText(this.text, this.linesQuantity);
  }

  toggleText(): void {
    this.showAllText = !this.showAllText;
  }

  truncateText(text: string, linesQuantity: number): string {
    this.showAllText = false;
    const elem = this.elemRef.nativeElement;
    const lineHeight =
      +this.window.getComputedStyle(elem).getPropertyValue('line-height').match(/\d+/)[0] || 0;
    const elemClone = elem.cloneNode(false) as HTMLElement;
    elem.appendChild(elemClone);
    let elemCloneHeight = elemClone.offsetHeight;
    const maxHeightElem = lineHeight * linesQuantity;
    let result = '';
    const wordlist = text.split(' ');
    // eslint-disable-next-line no-restricted-syntax
    for (const word of wordlist) {
      result += `${word} [...]`;
      elemClone.innerText = result;
      elemCloneHeight = elemClone.offsetHeight;
      if (elemCloneHeight > maxHeightElem) {
        const j = result.lastIndexOf(word) || result.length;
        result = result.slice(0, j).replace(/[,\s]*$/, '');
        elem.removeChild(elemClone);
        return result;
      }
      result = result.replace(' [...]', ' ');
    }
    elem.removeChild(elemClone);
    this.showAllText = true;
    return result;
  }
}
