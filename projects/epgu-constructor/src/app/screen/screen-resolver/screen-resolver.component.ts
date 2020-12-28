import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { ScreenTypes } from '../screen.types';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-screen-resolver',
  templateUrl: './screen-resolver.component.html',
  styleUrls: ['./screen-resolver.component.scss'],
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
        delay(0), // fix dirty checked errors
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

  createComponent(screenType: ScreenTypes): void {
    const screenComponent = this.getScreenComponentByType(screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(screenType);
    }

    const componentFactory: ComponentFactory<ScreenComponent> = this.componentFactoryResolver.resolveComponentFactory(
      screenComponent,
    );

    this.componentRef = this.screenContainer.createComponent(componentFactory);
  }

  getScreenComponentByType(screenType: ScreenTypes): Type<ScreenComponent> {
    return SCREEN_COMPONENTS[screenType];
  }

  private handleScreenComponentError(screenType: ScreenTypes): never {
    throw new Error(`We cant find screen component for this screen type: ${screenType}`);
  }
}
