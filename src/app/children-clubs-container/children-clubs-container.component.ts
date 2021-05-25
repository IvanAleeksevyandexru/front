import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fp-container',
  templateUrl: './children-clubs-container.component.html',
  styleUrls: ['./children-clubs-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenClubsContainerComponent {
  constructor() {}
}
