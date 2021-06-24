import { Injectable } from '@angular/core';
import { Clarifications } from '@epgu/epgu-constructor-types';
import { Filters, FindOptionsGroup, VendorType } from '../../typings';
import { AppStateQuery, AppStateService } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue } from '../../children-clubs.types';
import { cloneDeep } from 'lodash';

@Injectable()
export class StateServiceStub {
  state$ = this.stateQuery.state$;

  constructor(
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  changeState(state: Partial<ChildrenClubsState>): void {
    this.appStateService.updateState({ ...this.stateQuery.state, ...state });
  }

  get vendor(): VendorType {
    return VendorType.pfdo;
  }

  get okato(): number {
    return 123;
  }

  get clarifications(): Clarifications {
    return {
      aboutpayment: {
        title: 'Подробнее о способах оплаты',
        text:
          // eslint-disable-next-line max-len
          '<h5 class="mb-8">Оплата зависит от типа программы</h5><ul class="mb-24"><li><b>Бесплатная</b> — оплата не потребуется. Муниципалитет устанавливает количество таких программ на ребёнка в год</li><li><b>Сертифицированная</b> — обучение оплачиваетсяиз средств на сертификате, ноне всегда полностью. Часть обучения может оплачиватьсяиз личных средств, если денег на сертификате недостаточно или стоимость кружка выше максимальной суммы, установленной муниципалитетом</li><li><b>Платная</b> — обучение оплачивается из личных средств полностью</li></ul><p class="mt-24"><a href="about:blank">О дополнительном образованиии и персонифицированном финансировании</a></p>',
      } as Clarifications,
    };
  }

  get nextSchoolYear(): boolean {
    return true;
  }

  get selectedProgramUUID(): string {
    return this.stateQuery.state?.selectedProgramUUID;
  }

  set selectedProgramUUID(selectedProgramUUID: string) {
    this.changeState({ selectedProgramUUID });
  }

  get programFilters(): Filters {
    return this.stateQuery.state?.programFilters
      ? cloneDeep(this.stateQuery.state?.programFilters)
      : {};
  }
  set programFilters(programFilters: Filters) {
    this.changeState({ programFilters });
  }

  get groupFilters(): FindOptionsGroup {
    return this.stateQuery.state?.groupFilters
      ? cloneDeep(this.stateQuery.state?.groupFilters)
      : ({ nextSchoolYear: this.nextSchoolYear, vendor: this.vendor } as FindOptionsGroup);
  }

  set groupFilters(groupFilters: FindOptionsGroup) {
    this.changeState({ groupFilters });
  }
}
