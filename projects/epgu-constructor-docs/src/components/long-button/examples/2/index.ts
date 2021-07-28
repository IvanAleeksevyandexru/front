import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'example-2-epgu-long-button-component',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example2EpguLongButtonComponent {
  @Input() selectedValue: string;
  @Input() label: string;
  @Input() description: string;
  @Input() value: string;
  @Input() isLoading: boolean;
  @Input() disabled: boolean;

  constructor(private cdr: ChangeDetectorRef) {}

  isShown(value: string): boolean {
    return this.isLoading && value === this.selectedValue;
  }

  onClick() {
    this.isLoading = !this.isLoading;
    this.cdr.detectChanges();
  }
}
