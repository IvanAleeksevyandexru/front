import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoEditorModalComponent } from './photo-editor-modal.component';

describe('PhotoEditorModalComponent', () => {
  let component: PhotoEditorModalComponent;
  let fixture: ComponentFixture<PhotoEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoEditorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
