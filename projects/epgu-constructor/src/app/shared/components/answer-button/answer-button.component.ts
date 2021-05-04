import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ComponentActionDto, ComponentAnswerDto } from 'epgu-constructor-types';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerButtonComponent implements OnInit {
  @Input() data: Partial<ComponentActionDto | ComponentAnswerDto>;
  @Input() selectedValue: string;

  isLoading: boolean;

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.screenService.isLoading$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((isLoading) => {
      this.isLoading = isLoading;
      this.changeDetectionRef.markForCheck();
    });
  }

  isShown(value: string): boolean {
    return this.isLoading && value === this.selectedValue;
  }
}
