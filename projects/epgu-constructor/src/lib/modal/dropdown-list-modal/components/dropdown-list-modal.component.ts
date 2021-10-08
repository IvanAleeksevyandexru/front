import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import {
  ModalBaseComponent,
  UnsubscribeService,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';

import { DropdownListContent, DropdownListItem } from '../dropdown-list.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ActionToolsService } from '../../../shared/directives/action/action-tools.service';

@Component({
  selector: 'epgu-constructor-dropdown-list-modal',
  templateUrl: './dropdown-list-modal.component.html',
  styleUrls: ['./dropdown-list-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListModalComponent extends ModalBaseComponent implements OnInit {
  data$ = this.screenService.display$.pipe(
    map(({ components }) => this.prepareClarifications(components)),
  );
  componentId: string;
  clarificationId: string;

  buttons = [
    {
      label: 'Закрыть',
      handler: (): void => this.closeModal(),
    },
  ];

  constructor(
    public injector: Injector,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private actionToolsService: ActionToolsService,
  ) {
    super(injector);
    this.actionToolsService.dropdownListModalComponent = this;
  }

  ngOnInit(): void {
    this.eventBusService
      .on('closeModalEvent_dr_modal')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  private prepareClarifications(
    components: ComponentDto[],
  ): { title: string; items: DropdownListItem[] } {
    const componentWithClarifications = this.getComponentDto(components);

    if (componentWithClarifications) {
      const {
        attrs: { clarifications },
      } = componentWithClarifications;

      return (clarifications as DropdownListContent)[this.clarificationId];
    }
    return null;
  }

  private getComponentDto(components: ComponentDto[]): ComponentDto {
    const isUniqueWithRepeatable =
      components[0].type === UniqueScreenComponentTypes.repeatableFields;

    const findComponent = (cmp: ComponentDto[]): ComponentDto =>
      cmp.find(({ id }) => id === this.componentId);

    if (isUniqueWithRepeatable) {
      return findComponent(components[0].attrs.components);
    }
    return findComponent(components);
  }
}
