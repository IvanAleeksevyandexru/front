import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { SuggestAction } from '../../data';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent implements AfterViewInit {
  @ViewChild('cropper') cropper: LyImageCropper;
  @Input() isSuggests = false;
  @Input() files: FileItem[];
  @Input() suggests: FileItem[];
  @Input() set selectedId(id: string) {
    const index = this.files.findIndex((item) => item.id === id);
    this.selectedIndex = index === -1 ? null : index;
    this.selectedItem = this.selectedIndex ? this.files[this.selectedIndex] : null;
  }

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();

  selectedItem?: FileItem;
  selectedIndex?: number;

  cropConfig: ImgCropperConfig = {
    width: 306,
    height: 306 * (45 / 35),
    type: 'image/jpeg',
    output: {
      width: 413,
      height: 413 * (45 / 35),
    },
  };
  cropping = new Subject<ImgCropperEvent>();
  scale: number;

  imageLoaded(): void {
    console.log('Изображение загружено');
  }

  ngAfterViewInit(): void {
    if (this.selectedItem) {
      if (this.selectedItem.isImage) {
        this.cropper.setImageUrl(window.URL.createObjectURL(this.selectedItem.raw));
      }
    }
  }
}
