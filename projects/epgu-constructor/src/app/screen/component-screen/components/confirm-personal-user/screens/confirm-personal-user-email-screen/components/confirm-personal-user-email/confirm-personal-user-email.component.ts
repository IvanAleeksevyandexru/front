import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ScreenService } from '../../../../../../../screen.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email',
  templateUrl: './confirm-personal-user-email.component.html',
  styleUrls: ['./confirm-personal-user-email.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserEmailComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() error: string;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.currentAnswersService.isValid = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.currentAnswersService.state = this.data;
    }
  }
}
