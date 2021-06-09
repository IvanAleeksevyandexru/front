import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { FileDownloaderService } from '../../../../../../shared/services/file-downloader/file-downloader.service';

@Component({
  selector: 'epgu-constructor-car-owner-info-link',
  templateUrl: './car-owner-info-link.component.html',
  styleUrls: ['./car-owner-info-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOwnerInfoLinkComponent {
  @Input() pdfLink: string;
  constructor(public fileDownloader: FileDownloaderService, public config: ConfigService) {}
}
