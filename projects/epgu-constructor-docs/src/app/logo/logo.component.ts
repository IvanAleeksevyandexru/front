import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'example-logo',
  templateUrl: './logo.html',
  styleUrls: ['./logo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}

export const LOGO_CONTENT = new PolymorpheusComponent(LogoComponent);
