import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderComponent } from './uploader.component';

const createFileMock = (name: string, options: Record<string, any> = {}): File => {
  return new File([], name, { type: 'text/plain', lastModified: 0, ...options });
};

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;
  let container: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderComponent);
    container = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be drop event', () => {
    const event = (new Event('drop') as unknown) as any;

    event.dataTransfer = { files: [createFileMock('test.txt')] };
    jest.spyOn(component, 'drop');
    container.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.drop).toHaveBeenCalled();
    expect(component.isHighlight).toBeFalsy();
  });

  it('should be dragleave event', () => {
    jest.spyOn(component, 'dragleave');
    container.dispatchEvent(new Event('dragleave'));
    fixture.detectChanges();
    expect(component.dragleave).toHaveBeenCalled();
    expect(component.isHighlight).toBeFalsy();
  });

  it('should be dragover event', () => {
    jest.spyOn(component, 'dragover');
    container.dispatchEvent(new Event('dragover'));
    fixture.detectChanges();
    expect(component.dragover).toHaveBeenCalled();
    expect(component.isHighlight).toBeTruthy();
  });

  it('should be dragenter event', () => {
    jest.spyOn(component, 'dragenter');
    container.dispatchEvent(new Event('dragenter'));
    fixture.detectChanges();
    expect(component.dragenter).toHaveBeenCalled();
    expect(component.isHighlight).toBeTruthy();
  });
});
