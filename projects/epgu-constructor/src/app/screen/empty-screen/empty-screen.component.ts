import { Component } from '@angular/core';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';
import { InitDataService } from '../../core/services/init-data/init-data.service';

/**
 * Это технический компонент для организации каких-то действий не требующийх отображения данных.
 * @example сервер может прислать ссылку на которую нужно сделать редирект
 */
@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent {
  emptyComponentName = EmptyScreenComponentTypes;

  constructor(public screenService: ScreenService, private initDataService: InitDataService) {}

  /**
   * Возврат ссылки для редиректа
   */
  get redirectLink(): string {
    const { applicantAnswers } = this.screenService;
    const ref = this.screenService.component?.attrs?.ref as string;
    const addContextQueryParams = this.screenService.component?.attrs?.addContextQueryParams;
    const linkFromRef = (): string => applicantAnswers[ref]?.value;
    const linkFromComponent = (): string => this.screenService.component?.attrs?.link;
    const queryParams = addContextQueryParams ? this.initDataService.context?.queryParams : '';
    return `${ref ? linkFromRef() : linkFromComponent()}${queryParams}`;
  }
}
