import { Directive, HostListener, Input } from '@angular/core';
import { TextTransform } from 'epgu-constructor-types';
import { TextTransformService } from '../../services/text-transform/text-transform.service';

@Directive({
  selector: '[epgu-constructor-text-transform]'
})
export class TextTransformDirective {
  @Input() textTransformType: TextTransform;
  private transforms = {
    [TextTransform.ALL]: this.firstLetterOfEachWordToUpperCase,
    [TextTransform.FIRST]: this.firstLetterToUpperCase,
    [TextTransform.UPPERCASE]: this.allToUpperCase,
  };
  private prevValue: string;
  private prevSelection: [number, number];

  constructor(
    private textTransform: TextTransformService,
  ) {}

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    if (!this.transforms[this.textTransformType]) {
      return;
    }
    // Проверяет, изменилось ли значение, возвращает курсор
    if (this.prevValue === target.value) {
      target.setSelectionRange(...this.prevSelection);
      return;
    }
    const selection: [number, number] = [target.selectionStart, target.selectionEnd];
    target.value = this.transforms[this.textTransformType].call(this, target.value);
    target.setSelectionRange(...selection);


    // Сохраняет предыдущее значение и позицию курсора
    this.prevValue = target.value;
    this.prevSelection = selection;
  }

  public firstLetterOfEachWordToUpperCase(value: string): string {
    return this.textTransform.firstLetterOfEachWordToUpperCase(value);
  }

  public firstLetterToUpperCase(value: string = ''): string {
    return this.textTransform.firstLetterToUpperCase(value);
  }

  public allToUpperCase(value: string = ''): string {
    return this.textTransform.allToUpperCase(value);
  }
}
