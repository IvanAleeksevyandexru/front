import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseInterceptor } from '../../../../../../core/interceptor/base/base.interceptor';
import { PROGRAM_DETAIL_SUB_URL, SEARCH_GROUP_SUB_URL } from '../../services/health/health-handler';
import { MicroAppNavigationService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class DisplayProjectListInterceptor extends BaseInterceptor {
  constructor(private navigationService: MicroAppNavigationService) {
    super();
  }

  validate(response: HttpResponse<unknown> | HttpErrorResponse): boolean {
    const { url } = response as HttpResponse<unknown>;

    return url.includes(SEARCH_GROUP_SUB_URL) || url.includes(PROGRAM_DETAIL_SUB_URL);
  }

  handle(): void {
    this.navigationService.toDisplay('projectList');
  }

  protected checkStatus(status: number): boolean {
    return status >= 400;
  }
}
