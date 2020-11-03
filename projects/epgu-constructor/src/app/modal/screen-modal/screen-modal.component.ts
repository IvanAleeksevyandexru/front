import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HelperService } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import {
  FormPlayerNavigation,
  Navigation,
  NavigationPayload,
} from '../../form-player/form-player.types';
import { NavigationModalService } from '../../core/services/navigation-modal/navigation-modal.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenModalService } from './screen-modal.service';
import { ScreenService } from '../../screen/screen.service';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { ScreenTypes } from '../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-screen-modal',
  templateUrl: './screen-modal.component.html',
  styleUrls: ['./screen-modal.component.scss'],
  providers: [ScreenService, ScreenModalService], // Нужен отдельный инстанс для ScreenService
})
export class ScreenModalComponent extends ModalBaseComponent implements OnInit {
  scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  showCrossButton = true;
  isMobile: boolean;
  isValid: boolean;
  screenTypes = ScreenTypes;

  @ViewChild('headerBlock') headerBlock: ElementRef;

  constructor(
    public screenModalService: ScreenModalService,
    public screenService: ScreenService,
    private navModalService: NavigationModalService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isMobile = HelperService.isMobile();

    this.navModalService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navModalService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));
  }

  ngAfterViewInit() {
    console.log('header offsetHeight');
    console.log(this.headerBlock?.nativeElement?.offsetHeight ?? 0);
  }

  nextStep(navigation?: Navigation) {
    this.screenModalService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  prevStep(navigation?: Navigation) {
    this.screenModalService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  closeModal(): void {
    this.screenModalService.resetStore();
  }
}
