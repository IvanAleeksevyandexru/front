import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import {
  ComponentActionDto,
  ComponentAnswerDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss'],
  providers: [UnsubscribeService],
})
export class AnswerButtonComponent implements OnInit {
  @Input() data: Partial<ComponentActionDto | ComponentAnswerDto>;
  @Input() selectedValue: string;

  isLoading: boolean;

  constructor(public screenService: ScreenService, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.screenService.isLoading$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  isShown(value: string): boolean {
    return this.isLoading && value === this.selectedValue;
  }
}
