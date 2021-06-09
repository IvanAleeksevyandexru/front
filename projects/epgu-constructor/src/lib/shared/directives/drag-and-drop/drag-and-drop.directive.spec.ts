import { CurrencyPipe } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DragAndDropDirective } from './drag-and-drop.directive';

class FileListMock {
  readonly length: number = 1;
  item(index: number): File | null {
    return this[index];
  }
  [index: number]: File;
}

const createDragEventMock = (fileList: FileList) => {
  return {
    stopPropagation() {
      return null;
    },
    preventDefault() {
      return null;
    },
    dataTransfer: { files: fileList },
  };
};

@Component({
  selector: 'epgu-constructor-drag-and-drop-test-component',
  template: '<div dragAndDrop></div>',
  providers: [UnsubscribeService],
})
class DragAndDropTestComponent {
  e: FileList;
  constructor(
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.eventBusService
      .on('fileDropped')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileList) => this.onFileSelected(payload));
  }
  onFileSelected(e: FileList) {
    this.e = e;
  }
}

describe('DragAndDropDirective', () => {
  let fixture: ComponentFixture<DragAndDropTestComponent>;
  let comp: DragAndDropTestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragAndDropDirective, DragAndDropTestComponent],
      providers: [CurrencyPipe, EventBusService, UnsubscribeService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DragAndDropTestComponent);
        comp = fixture.componentInstance;
      });
  });
  it('test drag and drop directive', () => {
    const div = fixture.debugElement.query(By.css('div'));
    const files = new FileListMock() as FileList;
    files[0] = new File([], '');
    fixture.detectChanges();
    spyOn(comp, 'onFileSelected').and.callThrough();
    div.triggerEventHandler('drop', createDragEventMock(files));
    fixture.detectChanges();
    expect(comp.onFileSelected).toHaveBeenCalled();
  });
});
