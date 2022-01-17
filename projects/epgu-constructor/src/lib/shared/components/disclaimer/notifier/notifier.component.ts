import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HelperService } from '@epgu/ui/services/helper';
import {
  Notifier,
  NOTIFIER_DEFAULT_SETTING,
  NotifierSetting,
  NotifierType,
} from './notifier.model';
import { NotifierDisclaimerService } from '../../../services/notifier/notifier.service';

const ANIMATION_TIME = 200;

@Component({
  selector: 'epgu-constructor-notifier-disclaimer',
  templateUrl: 'notifier.component.html',
  styleUrls: ['./notifier.component.scss'],
})
export class NotifierDisclaimerComponent implements OnInit, OnDestroy {
  @ViewChild('notifiersList', { static: false }) private notifiersList: ElementRef;

  public notifiers: Notifier[] = [];
  public NotifierType = NotifierType;
  public containerTop = 0;
  public animationQueue = [];
  public animationInProgress = false;

  private subscription: Subscription;
  private stack: Notifier[] = [];

  constructor(
    @Inject('notifierSetting') public setting: NotifierSetting,
    private notifierService: NotifierDisclaimerService,
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2,
    private changeDetection: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.setting = Object.assign(NOTIFIER_DEFAULT_SETTING, this.setting);

    this.subscription = this.notifierService.notifier$.subscribe((notifier) => {
      const maxCount = this.setting.singleNotifier ? 1 : this.setting.maxNotificationsCount;
      const containerTop = this.notifiersList.nativeElement.getBoundingClientRect().top;
      const notifications = this.notifiersList.nativeElement.children;
      const notificationHeight = notifications[notifications.length - 1]?.offsetHeight;
      const margin = HelperService.isMobile() || this.notifiers.length === 1 ? 0 : 8;
      const offsetTop = containerTop - notificationHeight - margin;
      const animationPlayer = this.animationPlayer(containerTop, offsetTop);

      this.notifiers.push(notifier);

      if (this.notifiers.length > maxCount) {
        this.stack.push(this.notifiers.pop());
      } else {
        this.renderer.setStyle(this.notifiersList.nativeElement, 'top', `${offsetTop}px`);
        this.changeDetection.detectChanges();

        if (this.setting.animated) {
          const animation = (): void => {
            this.animationInProgress = true;

            animationPlayer.onDone(() => {
              this.animationInProgress = false;
              this.animationQueue = this.animationQueue.filter(
                (animationInQueue) => animationInQueue !== animation,
              );
              animationPlayer.destroy();
              this.renderer.setStyle(this.notifiersList.nativeElement, 'top', null);
            });

            animationPlayer.play();
          };

          this.animationQueue.push(animation);

          if (!this.animationInProgress) {
            window.requestAnimationFrame(() => {
              animation();
            });
          }
        }
      }

      if (this.setting.removeDelay !== null && this.setting.removeDelay !== undefined) {
        setTimeout(() => {
          this.removeNotifier(notifier, false);
        }, this.setting.removeDelay + (this.setting.animated ? ANIMATION_TIME : 0));
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public removeNotifier(notifierToRemove: Notifier, immediate = true): void {
    const index = this.notifiers.findIndex((notifier) => notifier === notifierToRemove);
    if (index === -1) {
      return;
    }
    const handleDone = (): void => {
      this.notifiers = this.notifiers.filter((notifier) => notifier !== notifierToRemove);
      if (this.stack.length) {
        this.notifiers.push(this.stack.pop());
      }
      this.changeDetection.detectChanges();
    };
    if (!this.setting.animated || immediate) {
      handleDone();
    } else {
      const closeAllShown =
        this.setting.showCloseAllCount && this.notifiers.length >= this.setting.showCloseAllCount;
      const notificationPosition = closeAllShown ? index + 1 : index;
      const notification = this.notifiersList.nativeElement.children[notificationPosition];
      const animationPlayer = this.animationBuilder
        .build([style({ opacity: 1 }), animate(ANIMATION_TIME, style({ opacity: 0 }))])
        .create(notification);
      animationPlayer.onDone(() => {
        animationPlayer.destroy();
        this.renderer.setStyle(notification, 'visibility', 'hidden');
        handleDone();
      });
      animationPlayer.play();
    }
  }

  public cancelNotifier(notifier: Notifier): void {
    notifier.onCancel();
    this.removeNotifier(notifier);
  }

  public actionNotifier(notifier: Notifier): void {
    notifier.onAction();
    this.removeNotifier(notifier);
  }

  public trackNotifierById(_index, notifier: Notifier): string {
    return notifier.notifierId;
  }

  private animationPlayer = (containerTop, offsetTop): AnimationPlayer =>
    this.animationBuilder
      .build([
        style({ top: `${containerTop}px` }),
        animate(ANIMATION_TIME, style({ top: `${offsetTop}px` })),
      ])
      .create(this.notifiersList.nativeElement);
}
