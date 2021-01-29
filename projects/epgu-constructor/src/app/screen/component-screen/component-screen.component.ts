import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ScreenBase } from '../screenBase';

@Component({
  selector: 'epgu-constructor-component-screen',
  templateUrl: './component-screen.component.html',
  styleUrls: ['./component-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentScreenComponent extends ScreenBase {
  constructor(public injector: Injector) {
    super(injector);
  }

  nextStep(): void {
    // TODO: заглушка абстрактного метода ScreenBase
  }
}
