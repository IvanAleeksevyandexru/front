import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';
import { InitDataService } from '../../core/services/init-data/init-data.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { LocationService } from '../../core/services/location/location.service';
import {
  ApplicantAnswersDto,
  ComponentDto,
} from '../../form-player/services/form-player-api/form-player-api.types';

/**
 * Это технический компонент для организации каких-то действий не требующийх отображения данных.
 * @example сервер может прислать ссылку на которую нужно сделать редирект
 */
@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyScreenComponent {
  emptyComponentName = EmptyScreenComponentTypes;

  navigationMap: Record<string, Function> = {
    home: this.navigationService.redirectToHome.bind(this.navigationService),
    redirectToLK: this.navigationService.redirectToLK.bind(this.navigationService),
  };

  /**
   * Возврат ссылки для редиректа
   */
  redirectLink$: Observable<Function> = combineLatest([
    this.screenService.component$,
    this.screenService.applicantAnswers$,
  ]).pipe(map(this.createLink.bind(this)));

  constructor(
    public screenService: ScreenService,
    private initDataService: InitDataService,
    private navigationService: NavigationService,
    private locationService: LocationService,
  ) {}

  createLink([component, applicantAnswers]: [ComponentDto, ApplicantAnswersDto]): Function {
    const { actions, link } = component?.attrs;
    const refLink = applicantAnswers[component?.attrs?.ref as string]?.value;
    let result: Function;

    if (link) {
      result = this.locationService.href.bind(this.locationService, `${link}${this.queryParams()}`);
    } else if (actions?.length > 0) {
      const type = this.navigationMap[actions[0]?.type as string] ? actions[0].type : 'home';
      result = this.navigationMap[type];
    } else {
      result = this.locationService.href.bind(
        this.locationService,
        `${refLink}${this.queryParams()}`,
      );
    }
    return result;
  }

  queryParams(): string {
    const addContextQueryParams = this.screenService.component?.attrs?.addContextQueryParams;
    if (addContextQueryParams) {
      const params = this.initDataService.queryParams
        ? Object.entries(this.initDataService.queryParams)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        : '';
      return params.length > 0 ? `?${params}` : '';
    }
    return '';
  }
}
