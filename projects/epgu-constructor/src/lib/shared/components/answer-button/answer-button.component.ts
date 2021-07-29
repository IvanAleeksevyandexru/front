import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ComponentAnswerDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerButtonComponent implements OnInit {
  @Input() data: Partial<ComponentAnswerDto>;
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

  handleOutputHtmlClick(event: MouseEvent): void {
    const target = event.target as Element;
    // при клике по ссылке в answer-button, блокируем переход на следующий экран (открывается clarifications)
    if (target.tagName === 'A' && target.id && this.data?.attrs?.clarifications[target.id]) {
      event.stopPropagation();
    }
  }
}
