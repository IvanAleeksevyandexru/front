import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService, DownloadService } from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'epgu-constructor-car-owner-info-link',
  templateUrl: './car-owner-info-link.component.html',
  styleUrls: ['./car-owner-info-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOwnerInfoLinkComponent {
  @Input() pdfLink: string;
  constructor(public downloadService: DownloadService, public config: ConfigService) {}
}
