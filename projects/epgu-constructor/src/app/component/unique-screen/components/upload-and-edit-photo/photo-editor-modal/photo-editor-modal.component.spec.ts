import { LyTheme2, LY_THEME, LY_THEME_NAME, StyleRenderer } from '@alyle/ui';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { LoggerService } from '../../../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../../../core/services/logger/logger.service.stub';
import { SliderComponent } from '../slider/slider.component';
import { PhotoEditorModalComponent } from './photo-editor-modal.component';


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
        { provide: LoggerService, useClass: LoggerServiceStub },
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
