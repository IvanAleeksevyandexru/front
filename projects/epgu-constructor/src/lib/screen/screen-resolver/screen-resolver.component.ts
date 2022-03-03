import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { filter, subscribeOn, takeUntil, tap } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { FooterService } from '@epgu/ui/services/footer';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { ScreenService } from '../screen.service';
import { NO_FOOTER_COMPONENTS } from '../../shared/constants/no-footer-components';

@Component({
  selector: 'epgu-constructor-screen-resolver',
  templateUrl: './screen-resolver.component.html',
  styleUrls: ['./screen-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ScreenResolverComponent implements AfterViewInit, OnDestroy {
  @ViewChild('screenContainer', { read: ViewContainerRef }) screenContainer: ViewContainerRef;
  componentRef: ComponentRef<ScreenComponent>;

  constructor(
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private footerService: FooterService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.screenService.screenType$
      .pipe(
        filter(() => !this.screenService.isTheSameScreenWithErrors),
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler), // fix dirty checked errors
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((screenType) => {
        this.createComponent(screenType);
      });
    this.handleFooterDisplaying();
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private getScreenComponentByType(screenType: ScreenTypes): Type<ScreenComponent> {
    return SCREEN_COMPONENTS[screenType];
  }

  private handleScreenComponentError(screenType: ScreenTypes): never {
    throw new Error(`We cant find screen component for this screen type: ${screenType}`);
  }

  private createComponent(screenType: ScreenTypes): void {
    const screenComponent = this.getScreenComponentByType(screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(screenType);
    }

    this.componentRef = this.screenContainer.createComponent(screenComponent);
    this.cdRef.markForCheck();
  }

  private handleFooterDisplaying(): void {
    this.screenService.componentType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((type) => {
      const isVisible = !NO_FOOTER_COMPONENTS.includes(type);
      this.footerService.setVisible(isVisible);
    });
  }
}
