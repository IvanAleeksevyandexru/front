import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { subscribeOn, takeUntil, tap } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { ScreenTypes } from '../screen.types';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-screen-resolver',
  templateUrl: './screen-resolver.component.html',
  styleUrls: ['./screen-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
  providers: [UnsubscribeService],
})
export class ScreenResolverComponent implements AfterViewInit {
  @ViewChild('screenContainer', { read: ViewContainerRef }) screenContainer: ViewContainerRef;
  componentRef: ComponentRef<ScreenComponent>;

  constructor(
    private screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngAfterViewInit(): void {
    this.screenService.screenType$
      .pipe(
        tap(() => this.destroyComponent()),
        subscribeOn(asyncScheduler), // fix dirty checked errors
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((screenType) => {
        this.createComponent(screenType);
      });
  }

  destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  getScreenComponentByType(screenType: ScreenTypes): Type<ScreenComponent> {
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

    const componentFactory: ComponentFactory<ScreenComponent> = this.componentFactoryResolver.resolveComponentFactory(
      screenComponent,
    );

    this.componentRef = this.screenContainer.createComponent(componentFactory);
  }
}
