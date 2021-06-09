import {
  Input,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'epgu-constructor-uploader-button',
  templateUrl: './uploader-button.component.html',
  styleUrls: ['./uploader-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderButtonComponent {
  @Input() accept: string;
  @Input() capture?: 'user' | 'environment';
  @Input() multiple = false;
  @Output() selects = new EventEmitter<FileList>();
  @ViewChild('input', { static: true })
  input: ElementRef;

  @HostListener('click')
  click(): void {
    this.input.nativeElement.click();
  }

  reset(): void {
    this.input.nativeElement.value = null;
  }

  select(files: FileList): void {
    this.selects.emit(files);
  }
}
