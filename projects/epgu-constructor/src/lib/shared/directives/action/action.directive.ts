import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { BusEventType, EventBusService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { ActionType, ComponentActionDto } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ActionService } from './action.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentActionDto;

  @Input() componentId: string;

  constructor(
    private el: ElementRef,
    private readonly actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
    private modalService: ModalService,
    private eventBusService: EventBusService,
  ) {}

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLButtonElement;
    if (this.canSwitchActionAfterKeyDown(event, target)) {
      event.preventDefault();
      if (this.currentAnswersService.isValid) {
        this.eventBusService.emit(BusEventType.GetNextStepWithoutClickedButtonEvent);
        this.actionService.switchAction(this.action, this.componentId);
      }
    }
  }

  @HostListener('click') onClick(): void {
    if (this.action) {
      this.actionService.switchAction(this.action, this.componentId);
    }
  }

  isDisabled(): boolean {
    return Boolean(
      this.el.nativeElement?.classList.contains('disabled') ||
        this.el.nativeElement?.querySelector('[disabled]'),
    );
  }

  canSwitchActionAfterKeyDown(event: KeyboardEvent, target: HTMLButtonElement): boolean {
    return (
      !this.isDisabled() &&
      event.key === 'Enter' &&
      this.action?.type === ActionType.nextStep &&
      !target.classList.contains('multiline-input') &&
      target?.name !== 'prev' &&
      target.nodeName !== 'A' &&
      !this.modalService.isModalOpen()
    );
  }
}
