import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  ViewChild,
  Type,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { subscribeOn, takeUntil, tap } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { AppRoutingService } from '../app-routing/app-routing.service';

@Component({
  selector: 'epgu-cf-ui-app-component-resolver',
  templateUrl: './app-component-resolver.component.html',
  styleUrls: ['./app-component-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class AppComponentResolverComponent implements AfterViewInit, OnDestroy {
  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  componentRef: ComponentRef<unknown>;

  constructor(
    private appRoutingService: AppRoutingService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.appRoutingService.component$
      .pipe(
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler), // fix dirty checked errors
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((component) => {
        this.createComponent(component);
      });
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.cdr.markForCheck();
  }

  private handleEmptyComponentError(component: Type<unknown>): never {
    throw new Error(`We cant find component: ${component}`);
  }

  private createComponent(component: Type<unknown>): void {
    if (!component) {
      this.handleEmptyComponentError(component);
    }

    const componentFactory: ComponentFactory<unknown> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );

    this.componentRef = this.componentContainer.createComponent(componentFactory);
    this.cdr.markForCheck();
  }
}
