import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Injector,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MicroAppBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { tap } from 'rxjs/operators';
import { ChildrenClubsState, ChildrenClubsValue } from './children-clubs.types';
import { StateService } from './services/state/state.service';

@Component({
  selector: 'children-clubs-app',
  templateUrl: './children-clubs-app.component.html',
  styleUrls: ['../styles/index.scss', './children-clubs-app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenClubsAppComponent
  extends MicroAppBaseComponent<ChildrenClubsValue, ChildrenClubsState>
  implements OnInit {
  @HostBinding('class.micro-app-host') class = true;
  public appType = 'ChildrenClubs';
  public isLoaderVisible$ = this.stateService.isLoaderVisible$.pipe(
    tap(() => setTimeout(() => this.cdr.detectChanges(), 0)),
  );

  constructor(public injector: Injector, public stateService: StateService) {
    super(injector);
  }

  ngOnInit(): void {
    this.openApp();
  }
}
