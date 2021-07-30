import { ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  ViewChild,
} from '@angular/core';
import {
  IdentificationStreamService,
  LunaPassConstructor,
} from '../../../../shared/identification-stream/identification-stream.service';
import { TerraByteApiService } from '../../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { test_image } from './data';

@Component({
  selector: 'epgu-constructor-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoModalComponent extends ModalBaseComponent implements AfterViewInit {
  @ViewChild('streamElement', { static: true }) streamElement: ElementRef;

  luna?: LunaPassConstructor;

  constructor(public injector: Injector, public streamService: IdentificationStreamService) {
    super(injector);
  }

  onReady(): void {}
  onSuccess(): void {}

  ngAfterViewInit(): void {
    this.luna = this.streamService.createVideoStream(
      this.streamElement?.nativeElement,
      () => this.onReady(),
      () => this.onSuccess(),
    );

    setTimeout(() => {
      this.modalResult.next({
        file: TerraByteApiService.base64toBlob(test_image.image.data, test_image.image.mime),
        status: true,
      });
      this.closeModal();
    }, 5000);
  }
}
