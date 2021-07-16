import { Component, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';

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

  constructor(protected elemRef: ElementRef<HTMLElement>) {}

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
    const elem = this.elemRef.nativeElement;
    const lineHeight =
      +getComputedStyle(elem)
        .getPropertyValue('line-height')
        .match(/\d{1,}/)[0] || 10;
    const elemClone = elem.cloneNode(false) as HTMLElement;
    elem.appendChild(elemClone);
    let heightElemClone = elemClone.offsetHeight;
    const maxHeightElem = lineHeight * linesQuantity;
    let result = '';
    const wordlist = text.split(' ');
    // eslint-disable-next-line no-restricted-syntax
    for (const word of wordlist) {
      result += `${word} [...]`;
      elemClone.innerText = result;
      heightElemClone = elemClone.offsetHeight;
      if (heightElemClone > maxHeightElem) {
        const j = result.lastIndexOf(word) || result.length;
        result = result.slice(0, j).replace(/,\s*$/, '');
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
