import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { combineLatest } from 'rxjs';
import { pluck, startWith, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { KinderGardenAttrs } from '@epgu/epgu-constructor-types';
import { FormControl, Validators } from '@angular/forms';
import { NotifierService } from '@epgu/epgu-lib';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';

import { PriorityItemsService } from '../../services/priority-items/priority-items.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-priority-screen',
  templateUrl: './priority-screen.component.html',
  styleUrls: ['./priority-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PriorityScreenComponent {
  @Input() changedMaxKinderGarden: boolean;

  @Output() selectMap = new EventEmitter<null>();
  @Output() showMap = new EventEmitter<DictionaryItem>();
  @Output() back = new EventEmitter<null>();

  attrs$: Observable<KinderGardenAttrs> = this.screenService.component$.pipe(
    pluck('attrs', 'mapKinderGardenPriorityAttrs'),
  );

  controlCheckbox = new FormControl({ value: true, disabled: false }, Validators.required);

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
    this.itemsService.remove(item);
    //
    // this.notify.success({
    //   type: NotifierType.Success,
    //   message: 'Сад убран из списка',
    //   onAction: () => {
    //     this.itemsService.remove(item);
    //   },
    //   onCancel: () => {},
    //   notifierId: `REMOVE_${item?.attributeValues?.CODE}`,
    // });
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
