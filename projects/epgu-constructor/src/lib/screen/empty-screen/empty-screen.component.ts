import { ChangeDetectionStrategy, Component } from '@angular/core';
import { delayWhen, filter, map } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import {
  ActionType,
  ApplicantAnswersDto,
  ComponentActionDto,
  ComponentDto,
} from '@epgu/epgu-constructor-types';
import { LocationService, UnsubscribeService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';
import { InitDataService } from '../../core/services/init-data/init-data.service';
import { FileDownloaderService } from '../../shared/services/file-downloader/file-downloader.service';
import { ActionService } from '../../shared/directives/action/action.service';

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
  defaultAction = {
    type: ActionType.home,
    value: '',
    label: '',
  } as ComponentActionDto;
  /**
   * Возврат ссылки для редиректа
   */
  redirectLink$: Observable<Function | null> = combineLatest([
    this.screenService.component$,
    this.screenService.applicantAnswers$,
    this.screenService.isLogicComponentLoading$,
  ]).pipe(
    filter(([, , isLogicComponentLoading]) => !isLogicComponentLoading),
    delayWhen(([component]) => this.download(component.attrs.downloadLink)),
    map(this.createLink.bind(this)),
  );

  constructor(
    public screenService: ScreenService,
    private initDataService: InitDataService,
    private locationService: LocationService,
    private loggerService: LoggerService,
    private fileDownloaderService: FileDownloaderService,
    private actionService: ActionService,
  ) {}

  createLink([component, applicantAnswers]: [ComponentDto, ApplicantAnswersDto]): Function {
    const { actions, link } = component?.attrs;
    const refLink = applicantAnswers[component?.attrs?.ref as string]?.value;
    let result: Function;

    if (link) {
      result = this.locationService.href.bind(this.locationService, `${link}${this.queryParams()}`);
    } else if (actions?.length > 0) {
      result = this.actionService.switchAction.bind(
        this.actionService,
        actions[0].type ? actions[0] : this.defaultAction,
        this.screenService.component.id,
      );
    } else if (refLink) {
      result = this.locationService.href.bind(
        this.locationService,
        `${refLink}${this.queryParams()}`,
      );
    } else {
      result = (): void =>
        this.loggerService.error(['unknown redirect link'], 'EmptyScreenComponent');
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

  private download(downloadLink?: string): Observable<unknown> {
    return downloadLink ? this.fileDownloaderService.download(downloadLink) : of();
  }
}
