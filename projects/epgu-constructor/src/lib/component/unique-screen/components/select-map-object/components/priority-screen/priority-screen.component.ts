import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { combineLatest } from 'rxjs';
import { pluck, startWith, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { KinderGardenAttrs } from '@epgu/epgu-constructor-types';
import { FormControl, Validators } from '@angular/forms';
import { NotifierService, NotifierType } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';

import { PriorityItemsService } from '../../services/priority-items/priority-items.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-priority-screen',
  templateUrl: './priority-screen.component.html',
  styleUrls: ['./priority-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PriorityScreenComponent {
  @Output() selectMap = new EventEmitter<null>();
  @Output() showMap = new EventEmitter<DictionaryItem>();
  @Output() back = new EventEmitter<null>();

  displayCssClass$ = this.screenService.displayCssClass$;
  moreSize$ = this.itemsService.moreSize$;
  items$ = this.itemsService.items;
  maxKinderGarden$ = this.itemsService.maxKinderGarden$;
  oldMaxKinderGarden$ = this.itemsService.oldMaxKinderGarden$;
  screenItems$ = this.itemsService.screenItems;
  leftItems$ = this.itemsService.leftItems$;
  disabled$ = this.itemsService.disabled$$;
  isLoading$ = this.screenService.isLoading$;
  maxIsChange$ = this.itemsService.maxIsChange$;

  attrs$: Observable<KinderGardenAttrs> = this.screenService.component$.pipe(
    pluck('attrs', 'mapKinderGardenPriorityAttrs'),
  );

  controlCheckbox = new FormControl({ value: true, disabled: false }, Validators.required);
  notifierId = 'NOTIFIERS_CHILDREN_GARDEN';
  plural = ['сад', 'сада', 'садов'];

  changes$ = combineLatest([
    this.itemsService.items,
    this.controlCheckbox.valueChanges.pipe(startWith(this.controlCheckbox.value)),
  ])
    .pipe(
      tap(([items, otherKinderGarden]) => {
        this.currentAnswersService.state = {
          otherKinderGarden,
          items: items.map((item) => item.attributeValues),
        };
      }),
      takeUntil(this.unsubscribeService.ngUnsubscribe$),
    )
    .subscribe();

  constructor(
    public itemsService: PriorityItemsService,
    public screenService: ScreenService,
    public notify: NotifierService,
    public unsubscribeService: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  backAction(): void {
    this.back.emit();
  }

  showAction(item: DictionaryItem): void {
    this.showMap.emit(item);
  }
  upAction(index: number): void {
    this.itemsService.raise(index);
  }
  downAction(index: number): void {
    this.itemsService.lower(index);
  }

  deleteAction(item: DictionaryItem): void {
    const context = this.itemsService.remove(item);
    if (context.index === -1) {
      return;
    }

    this.notify.success({
      type: NotifierType.Success,
      message: 'Сад убран из списка',
      onCancel: () => this.itemsService.cancel(context),
      notifierId: this.notifierId,
    });
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this.backAction();
    }
  }

  selectAction(): void {
    this.selectMap.emit();
  }

  rollUpAction(): void {
    this.itemsService.reset();
  }

  moreAction(): void {
    this.itemsService.more();
  }
}
