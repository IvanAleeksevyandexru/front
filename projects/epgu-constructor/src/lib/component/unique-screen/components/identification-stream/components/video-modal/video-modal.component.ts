import { LoggerService, ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';
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
  LunaPassFrameResult,
  LunaPassSuccess,
} from '../../../../shared/identification-stream/identification-stream.service';
import { TerraByteApiService } from '../../../../../../core/services/terra-byte-api/terra-byte-api.service';

@Component({
  selector: 'epgu-constructor-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoModalComponent extends ModalBaseComponent implements AfterViewInit {
  @ViewChild('streamElement', { static: true }) streamElement: ElementRef;

  luna?: LunaPassConstructor;

  constructor(
    public injector: Injector,
    public streamService: IdentificationStreamService,
    public logger: LoggerService,
  ) {
    super(injector);
  }

  onReady(): void {
    this.luna.checkLiveness();
  }

  close(): void {
    if (this.luna?.video) {
      const stream = this.luna.video.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => stream.removeTrack(track));

      this.luna.ws?.close(1000);
    }
    this.closeModal();
  }

  onSuccess(result: LunaPassSuccess): void {
    try {
      const frameResult: LunaPassFrameResult = JSON.parse(
        window.atob(result.jwt.replace('/"/', '').split('.')[1]),
      );
      if (frameResult.bestshot) {
        this.modalResult.next({
          file: TerraByteApiService.base64toBlob(
            `data:image/png;base64,${frameResult?.bestshot}`,
            'image/png',
          ),
        });
      }
      this.close();
    } catch (e) {
      this.logger.error([e]);
    }
  }

  ngAfterViewInit(): void {
    this.luna = this.streamService.createVideoStream(
      this.streamElement?.nativeElement,
      () => this.onReady(),
      (result) => this.onSuccess(result),
    );
  }
}
