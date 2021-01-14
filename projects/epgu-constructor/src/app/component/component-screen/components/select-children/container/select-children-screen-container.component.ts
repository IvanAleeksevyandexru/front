import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenStoreComponentDtoI } from '../../../../../screen/screen.types';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { CachedValue } from '../select-children.models';

@Component({
  selector: 'epgu-constructor-select-children-screen-container',
  templateUrl: './select-children-screen-container.component.html',
  styleUrls: ['./select-children-screen-container.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenScreenContainerComponent implements OnInit {
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    map((label) => label || 'Добавить ребенка'),
  );
  cachedValue$: Observable<CachedValue> = this.screenService.component$.pipe(
    map((data) => {
      const cachedValue = this.screenService.getCompValueFromCachedAnswers(data.id);

      return cachedValue
        ? this.cachedAnswersService.parseCachedValue<CachedValue>(cachedValue, data)
        : null;
    }),
  );
  component$: Observable<ScreenStoreComponentDtoI> = this.screenService.component$.pipe(
    map((component) => this.screenService.getCompFromDisplay(component.id)),
  );

  constructor(
    public screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private cachedAnswersService: CachedAnswersService,
  ) {}

  ngOnInit(): void {}

  public updateCurrentAnswersState(state: { [key: string]: string | number | boolean }[]): void {
    this.currentAnswersService.state = state;
  }

  public updateCurrentAnswersValid(isValid: boolean): void {
    this.currentAnswersService.isValid = isValid;
  }
}
