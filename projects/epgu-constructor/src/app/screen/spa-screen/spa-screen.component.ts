import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-spa-screen',
  templateUrl: './spa-screen.component.html',
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaScreenComponent extends ScreenBase implements OnInit {
  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}
