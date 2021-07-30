import { ChangeDetectionStrategy, Component } from '@angular/core';
import { concatMap, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ConfigService, ModalService } from '@epgu/epgu-constructor-ui-kit';

import { IdentificationApiService } from '../../shared/identification-api/identification-api.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';

import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-identification-stream',
  templateUrl: './identification-stream.component.html',
  styleUrls: ['./identification-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentificationStreamComponent {
  attrs = this.screenService.component?.attrs;
  component = this.screenService.component;
  display = this.screenService.display;
  header$: Observable<string> = combineLatest([
    this.screenService.component$,
    this.screenService.header$,
  ]).pipe(map(([data, header]: [ComponentBase, string]) => header || data.label));
  disabled$$ = new BehaviorSubject<boolean>(true);
  disabled$ = this.disabled$$.pipe(distinctUntilChanged());
  isLoading$: Observable<boolean> = this.screenService.isLoading$;

  result?: UploadedFile;
  apiLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    public screenService: ScreenService,
    public config: ConfigService,
    private modalService: ModalService,
    private api: IdentificationApiService,
    private tera: TerraByteApiService,
  ) {}

  mnemonic(): string {
    return `${this.component.id}.IdentificationStreamComponent.test.0`;
  }
  record(): void {
    this.modalService
      .openModal<{ file?: File; status?: boolean }>(VideoModalComponent)
      .pipe(
        filter((v) => v !== null),
        concatMap(({ file }) =>
          this.tera.uploadFile(
            {
              name: 'test.jpg',
              mimeType: 'image/jpeg',
              objectId: `${this.screenService.orderId}`,
              objectType: 2,
              mnemonic: this.mnemonic(),
            },
            file,
          ),
        ),
        concatMap(() =>
          this.tera.getFileInfo({
            objectId: `${this.screenService.orderId}`,
            objectType: 2,
            mnemonic: this.mnemonic(),
          }),
        ),
      )
      .subscribe((result) => {
        console.log(result);
        this.result = result;
      });
  }

  next(): void {}
}
