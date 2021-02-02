import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UploaderButtonComponent } from '../uploader-button/uploader-button.component';

@Component({
  selector: 'epgu-constructor-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderComponent implements AfterContentInit {
  @Output() upload = new EventEmitter<FileList>();
  @Input() isMobile: boolean;
  @ContentChildren(UploaderButtonComponent, { descendants: true }) buttons!: QueryList<
    UploaderButtonComponent
  >;
  isHighlight = false;
  subs: Subscription;

  @HostBinding('class.highlight')
  get classHighlight(): boolean {
    return this.isHighlight;
  }

  @HostListener('dragenter', ['$event'])
  dragenter(event: DragEvent): void {
    this.init(event);
    this.isHighlight = true;
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent): void {
    this.init(event);
    this.isHighlight = true;
  }

  @HostListener('dragleave', ['$event'])
  dragleave(event: DragEvent): void {
    this.init(event);
    this.isHighlight = false;
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent): void {
    this.init(event);
    this.isHighlight = false;
    if (event.dataTransfer.files.length > 0) {
      this.upload.emit(event.dataTransfer.files);
    }
  }

  init(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  ngAfterContentInit(): void {
    this.subs?.unsubscribe();
    this.subs = new Subscription();
    this.buttons.forEach((item) => {
      this.subs.add(
        item.selects
          .pipe(
            filter((files) => files.length > 0),
            tap((files) => this.upload.emit(files)),
          )
          .subscribe(),
      );
    });
  }
}
