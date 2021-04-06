import {
  Component,
  ChangeDetectionStrategy,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactory,
  AfterViewInit,
  ComponentRef,
  OnDestroy,
} from '@angular/core';
import { subscribeOn, tap } from 'rxjs/operators';
import { asyncScheduler, Subscription } from 'rxjs';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenTypes } from '../../../screen/screen.types';
import {
  ScreenModalComponents,
  ScreenModalComponentsType,
} from './screen-modal-resolver.constants';

@Component({
  selector: 'epgu-constructor-screen-modal-resolver',
  templateUrl: './screen-modal-resolver.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenModalResolverComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  public componentRef: ComponentRef<ScreenModalComponentsType>;
  private subs = new Subscription();

  constructor(
    private screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const screenType$ = this.screenService.screenType$
      .pipe(
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler), // fix dirty checked errors
      )
      .subscribe((screenType) => {
        this.createComponent(screenType);
        this.cdr.detectChanges();
      });
    this.subs.add(screenType$);
  }

  ngOnDestroy(): void {
    this.destroyComponent();
    this.subs.unsubscribe();
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  private createComponent(screenType: ScreenTypes): void {
    const component = ScreenModalComponents[screenType];

    if (!component) {
      this.handleComponentError(screenType);
    }

    const componentFactory: ComponentFactory<ScreenModalComponentsType> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.componentRef = this.modalContainer.createComponent(componentFactory);
  }

  private handleComponentError(screenType: ScreenTypes): never {
    throw new Error(`We cant find modal component for screen type: ${screenType}`);
  }
}
