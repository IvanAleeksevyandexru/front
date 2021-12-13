import { Component, ChangeDetectionStrategy } from '@angular/core';
import epguDocsPackages from '../../../package.json';

@Component({
  selector: 'example-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionsComponent {
  readonly header = 'Versions';
  readonly type = 'about';

  readonly ui = epguDocsPackages.dependencies['@epgu/ui'];
  readonly uiKit = epguDocsPackages.dependencies['@epgu/epgu-constructor-ui-kit'];
  readonly epguDocs = epguDocsPackages.version;
}
