import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { combineLatest, of, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponents } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../screen/screen.service';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookTypes } from '../../../core/services/hook/hook.constants';
import { LogicComponentResolverComponent } from '../component-list-resolver/logic-component-resolver.component';
import {
  isOnBeforeSubmitComponent,
  isOnInitComponent,
  isOnBeforeRejectComponent,
} from '../components/helpers';

@Component({
  selector: 'epgu-constructor-logic-container',
  templateUrl: './logic-components-container.component.html',
  styleUrls: ['./logic-components-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LogicComponentsContainerComponent implements OnInit, AfterViewInit {
  @ViewChildren('viewComponents') viewComponents: QueryList<LogicComponentResolverComponent>;
  isLoading$ = this.screenService.isLogicComponentLoading$;
  logicComponents$ = this.screenService.logicComponents$;
  loadSubscription: Subscription;
  isLoading = true;

  constructor(
    private screenService: ScreenService,
    private hookService: HookService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.logicComponents$
      .pipe(takeUntil(this.ngUnsubscribe$), distinctUntilChanged())
      .subscribe((components: LogicComponents[]) => {
        if (!components.filter(isOnBeforeSubmitComponent).length) {
          this.hookService.clearHook(HookTypes.ON_BEFORE_SUBMIT);
        }
        if (!components.filter(isOnBeforeRejectComponent).length) {
          this.hookService.clearHook(HookTypes.ON_BEFORE_REJECT);
        }
        if (components.filter(isOnInitComponent).length) {
          this.screenService.isLogicComponentLoading = true;
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      });
  }

  ngAfterViewInit(): void {
    this.resetInitSubscribe();
    this.viewComponents.changes.subscribe(() => {
      this.resetInitSubscribe();
    });
  }

  public logicAfterValidationComponents(): string {
    const trobber = this.screenService.trobber;
    if (trobber !== null) {
      return trobber?.message || '';
    }
    return '';
  }

  private resetInitSubscribe(): void {
    if (this.loadSubscription) this.loadSubscription.unsubscribe();
    this.subscribeToInitHooks();
  }

  private subscribeToInitHooks(): void {
    const hasLoadedSubjects = this.viewComponents
      .filter((component) => isOnInitComponent(component.componentDto))
      .map((component) => component.componentRef?.instance.hasLoaded ?? of(true));

    this.loadSubscription = combineLatest(hasLoadedSubjects)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((hasLoadedResult: boolean[]) => {
        if (hasLoadedResult.every((element: boolean) => !!element)) {
          window.requestAnimationFrame(() => {
            this.isLoading = false;
            this.screenService.isLogicComponentLoading = false;
            this.cdr.detectChanges();
          });
        }
      });
  }
}
