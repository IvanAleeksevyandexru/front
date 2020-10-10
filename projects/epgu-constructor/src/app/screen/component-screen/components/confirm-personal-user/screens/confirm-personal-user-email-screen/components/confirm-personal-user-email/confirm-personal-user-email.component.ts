import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ScreenService } from '../../../../../../../screen.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email',
  templateUrl: './confirm-personal-user-email.component.html',
  styleUrls: ['./confirm-personal-user-email.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserEmailComponent implements OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() error: string;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.currentAnswersService.state = this.data;
    }
  }
}
