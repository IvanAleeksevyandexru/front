import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { Navigation, NavigationPayload } from '@epgu/epgu-constructor-types';
import { CustomComponentOutputData } from '../../../../component/custom-screen/components-list.types';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { CustomScreenService } from '../../../../screen/custom-screen/custom-screen.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenModalService } from '../../screen-modal.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-component-list-modal',
  templateUrl: './component-list-modal.component.html',
  styleUrls: ['./component-list-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentListModalComponent {
  dataToSend: NavigationPayload;
  isValid: boolean;

  constructor(
    private navModalService: NavigationModalService,
    public screenService: ScreenService,
    public screenModalService: ScreenModalService,
    private customScreenService: CustomScreenService,
    private currentAnswersService: CurrentAnswersService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  nextStep(navigation?: Navigation): void {
    this.navModalService.next(navigation);
  }

  prevStep(navigation?: Navigation): void {
    this.navModalService.prev(navigation);
  }

  nextScreen(): void {
    const payload = this.dataToSend;
    this.nextStep({ payload });
  }

  changeComponentsList(changes: CustomComponentOutputData): void {
    this.isValid = Object.values(changes).every((item) => item.isValid);
    this.dataToSend = this.customScreenService.getFormattedData(changes);
    this.currentAnswersService.state = this.dataToSend;
    this.changeDetectorRef.detectChanges();
  }
}
