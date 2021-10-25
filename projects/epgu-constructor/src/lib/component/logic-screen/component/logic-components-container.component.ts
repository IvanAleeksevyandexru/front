import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { combineLatest, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScreenService } from '../../../screen/screen.service';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookTypes } from '../../../core/services/hook/hook.constants';
import { LogicComponentResolverComponent } from '../component-list-resolver/logic-component-resolver.component';
import { isOnBeforeSubmitComponent, isOnInitComponent } from '../components/helpers';

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
  onBeforeSubmitComponents$ = this.logicComponents$.pipe(
    map((components) => {
      return components.filter(isOnBeforeSubmitComponent);
    }),
  );
  onInitComponents$ = this.logicComponents$.pipe(
    map((components) => components.filter(isOnInitComponent)),
  );

  constructor(
    private screenService: ScreenService,
    private hookService: HookService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.onBeforeSubmitComponents$.subscribe((components) => {
      if (!components.length) {
        this.hookService.clearHook(HookTypes.ON_BEFORE_SUBMIT);
      }
    });
    this.onInitComponents$.subscribe((components) => {
      if (components.length) {
        this.screenService.isLogicComponentLoading = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.subscribeToInitHooks();
    this.viewComponents.changes.subscribe(() => {
      this.loadSubscription.unsubscribe();
      this.subscribeToInitHooks();
    });
  }

  private subscribeToInitHooks(): void {
    const hasLoadedSubjects = this.viewComponents
      .filter((component) => isOnInitComponent(component.componentDto))
      .map((component) => component.componentRef?.instance.hasLoaded || of(false));
    this.loadSubscription = combineLatest(hasLoadedSubjects).subscribe((hasLoadedResult) => {
      if (hasLoadedResult.every((element) => !!element)) {
        this.screenService.isLogicComponentLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
