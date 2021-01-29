import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Clarifications } from '../../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputHtmlComponent {
  @Input() html: string;
  @Input() clarifications: Clarifications;
}
