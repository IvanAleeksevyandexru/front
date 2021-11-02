import { ChangeDetectionStrategy, Component } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { SafePipe } from '@epgu/epgu-constructor-ui-kit';
import logoSvg from '!!raw-loader!../../assets/svg/gos_logo_mobile.svg';

@Component({
  selector: 'example-logo',
  templateUrl: './logo.html',
  styleUrls: ['./logo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SafePipe],
})
export class LogoComponent {
  public logo = this.safePipe.transform(logoSvg, 'resourceUrl');

  constructor(private safePipe: SafePipe) {}
}

export const LOGO_CONTENT = new PolymorpheusComponent(LogoComponent);
