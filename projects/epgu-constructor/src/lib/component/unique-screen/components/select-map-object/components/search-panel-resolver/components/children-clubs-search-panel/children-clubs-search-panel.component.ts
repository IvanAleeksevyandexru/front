import { AfterViewInit, ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonSearchPanelComponent } from '../common-search-panel/common-search-panel.component';
import {
  Filters,
  GroupFiltersModes,
} from '../../../../../children-clubs/models/children-clubs.types';
import { ProgramFiltersFormComponent } from '../../../../../children-clubs/components/base/components/program-filters-form/program-filters-form.component';
import { filter } from 'rxjs/operators';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../../../../../children-clubs/services/state/state.service';

@Component({
  selector: 'epgu-constructor-children-clubs-search-panel',
  templateUrl: '../common-search-panel/common-search-panel.component.html',
  styleUrls: ['../common-search-panel/common-search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenClubsSearchPanelComponent extends CommonSearchPanelComponent
  implements AfterViewInit {
  constructor(
    protected injector: Injector,
    protected modalService: ModalService,
    protected stateService: StateService,
  ) {
    super(injector);
  }

  public openFilters(): void {
    this.modalService
      .openModal<Filters>(ProgramFiltersFormComponent)
      .pipe(filter((filters) => !!filters))
      .subscribe((programFilters) => {
        this.stateService.programFilters = programFilters;
      });
  }

  public handleCustomNavBehavior(): void {
    this.stateService.changeState({
      groupFiltersMode: GroupFiltersModes.list,
    });
  }
}
