import { Directive, HostBinding, HostListener } from '@angular/core';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dragAndDrop]',
})
export class DragAndDropDirective {
  @HostBinding('class.file-over') fileOver: boolean;

  constructor(private eventBusService: EventBusService) {}

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const { files } = evt.dataTransfer;
    if (files.length > 0) {
      this.eventBusService.emit(BusEventType.FileDropped, files as FileList);
    }
  }
}
