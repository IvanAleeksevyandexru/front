import { DragAndDropDirective } from './drag-and-drop.directive';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { By } from '@angular/platform-browser';

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
  template: '<div dragAndDrop (fileDropped)="onFileSelected($event)"></div>',
})
class DragAndDropTestComponent {
  e: FileList;
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
      providers: [CurrencyPipe],
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
