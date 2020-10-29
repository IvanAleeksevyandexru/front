import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhotoEditorModalComponent } from './photo-editor-modal.component';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { EpguLibModule } from 'epgu-lib';
import { SliderComponent } from '../slider/slider.component';
import { LY_THEME, LY_THEME_NAME, LyTheme2, StyleRenderer } from '@alyle/ui';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { ConfigService } from '../../../../../shared/config/config.service';

describe('PhotoEditorModalComponent', () => {
  let component: PhotoEditorModalComponent;
  let fixture: ComponentFixture<PhotoEditorModalComponent>;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [ LyImageCropperModule, EpguLibModule ],
      providers: [
        ConfigService,
        [ LyTheme2 ],
        [ StyleRenderer ],
        // Theme that will be applied to this module
        { provide: LY_THEME_NAME, useValue: 'minima-light' },
        { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
        { provide: LY_THEME, useClass: MinimaDark, multi: true },
      ],
      declarations: [ PhotoEditorModalComponent, SliderComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
