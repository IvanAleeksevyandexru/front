import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KindergartenService, KindergartenStates } from './kindergarten.service';

@Component({
  selector: 'epgu-constructor-kindergarten',
  templateUrl: './kindergarten.component.html',
  styleUrls: ['./kindergarten.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenComponent {
  public readonly states = KindergartenStates;

  constructor(public kindergartenService: KindergartenService) {}
}
