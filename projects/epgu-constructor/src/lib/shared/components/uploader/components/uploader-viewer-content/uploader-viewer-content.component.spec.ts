import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BaseUiModule,
  ConfigService,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ActivatedRouteStub,
  IconsModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent, MockModule } from 'ng-mocks';
import { HttpClientModule } from '@angular/common/http';
import { FileSizeModule } from '@epgu/ui/pipes';
import { ZoomModule } from '../../../zoom/zoom.module';
import { UploaderViewerContentComponent } from './uploader-viewer-content.component';

import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { SuggestMonitorService } from '../../../../services/suggest-monitor/suggest-monitor.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import {
  FileUploadAttributes,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileItem, FileItemError, FileItemStatus } from '../../../file-upload/data';
import { FilesCollection, ViewerInfo } from '../../data';
import { OutputHtmlComponent } from '../../../output-html/output-html.component';
import { ComponentDto } from 'projects/epgu-constructor-types/src/base';
import { of } from 'rxjs';

const createUploadedFileMock = (options: Partial<TerraUploadFileOptions> = {}): UploadedFile => {
  return {
    fileName: '123.pdf',
    objectId: '123',
    mnemonic: 'fu1.FileUploadComponent.passport.1',
    mimeType: 'pdf',
    fileSize: 123,
    fileUid: 1882985687,
    metaId: 1874756798,
    objectTypeId: 2,
    fileExt: 'pdf',
    hasSign: false,
    created: '2021-03-18',
    updated: '2021-03-18',
    realPath: '62/0/0/18/82/98/56/Lw9wNROzOOo3',
    deleted: false,
    bucket: 'epgu202103',
    nodeId: 'f_dc',
    userId: 1000466316,
    uploaded: true,
    hasError: false,
    alternativeMimeTypes: [],
    ...options,
  };
};

const mockInfo = (name: string, status?: FileItemStatus, error?: FileItemError) => {
  const file = new FileItem(
    status ?? FileItemStatus.uploaded,
    '',
    null,
    createUploadedFileMock(
      name
        ? ({ fileName: name, mimeType: name.split('.').pop() } as Partial<TerraUploadFileOptions>)
        : {},
    ),
  );
  if (error) {
    file.setError(error);
  }
  return { file, position: 1, size: 1 } as ViewerInfo;
};

const mockComponent: ComponentDto = {
  attrs: {
    previewModalDescription: 'Test description',
  } as FileUploadAttributes,
  label: 'testComponent',
  type: '',
  id: '12',
  value: '',
};

describe('UploaderViewerContentComponent', () => {
  let component: UploaderViewerContentComponent;
  let fixture: ComponentFixture<UploaderViewerContentComponent>;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderViewerContentComponent, MockComponent(OutputHtmlComponent)],
      imports: [
        BaseUiModule,
        MockModule(ZoomModule),
        HttpClientModule,
        FileSizeModule,
        IconsModule,
      ],
      providers: [
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        SuggestMonitorService,
      ],
    })
      .overrideComponent(UploaderViewerContentComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderViewerContentComponent);
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    component = fixture.componentInstance;
    component.selectedItem = mockInfo('image.png', FileItemStatus.uploaded);
    fixture.detectChanges();
  });

  describe('info', () => {
    it('should be name', () => {
      expect(
        fixture.debugElement.query(By.css('.viewer__info-name'))?.nativeElement?.innerHTML?.trim(),
      ).toBe('image.png');
    });

    it('should be size', () => {
      expect(
        fixture.debugElement.query(By.css('.viewer__info-size'))?.nativeElement?.innerHTML?.trim(),
      ).toBe('123 Б');
    });

    it('should be date', () => {
      expect(
        fixture.debugElement.query(By.css('.viewer__info-date'))?.nativeElement?.innerHTML?.trim(),
      ).toBe('18.03.2021');
    });
  });

  describe('viewer', () => {
    it('should be prev', () => {
      jest.spyOn(component, 'prevAction');
      fixture.debugElement.query(By.css('.prev'))?.nativeElement?.click();
      expect(component.prevAction).toHaveBeenCalled();
    });
    it('should be next', () => {
      jest.spyOn(component, 'nextAction');
      fixture.debugElement.query(By.css('.next'))?.nativeElement?.click();
      expect(component.nextAction).toHaveBeenCalled();
    });
    it('should be open window', () => {
      component.imageURL = null;
      fixture.detectChanges();
      jest.spyOn(component, 'open');
      fixture.debugElement.query(By.css('.file-viewer__file'))?.nativeElement?.click();
      expect(component.open).toHaveBeenCalled();
    });
    it('should be error view title', () => {
      component.isError = true;
      fixture.detectChanges();
      expect(
        fixture.debugElement
          .query(By.css('.file-viewer__error-title'))
          ?.nativeElement?.innerHTML?.trim(),
      ).toBe('Что-то пошло не так');
    });
    it('should be error view description', () => {
      component.isError = true;
      fixture.detectChanges();
      expect(
        fixture.debugElement
          .query(By.css('.file-viewer__error-description'))
          ?.nativeElement?.innerHTML?.trim(),
      ).toBe('Попробуйте открыть файл снова или загрузите новый');
    });
    it('should be zoom component', () => {
      expect(fixture.debugElement.query(By.css('epgu-constructor-zoom'))).not.toBeNull();
    });
    it('should show description custom text', () => {
      expect(component.description).toBe(
        (mockComponent.attrs as FileUploadAttributes).previewModalDescription,
      );
    });
  });

  describe('confirmation', () => {
    it('should be cancelAction', () => {
      component.isConfirm = true;
      fixture.detectChanges();
      const cancelButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__confirmation-button_cancel'),
      )?.nativeElement;
      expect(cancelButton?.innerHTML?.trim()).toBe('Оставить');
      jest.spyOn(component, 'cancelAction');
      cancelButton?.click();
      fixture.detectChanges();
      expect(component.cancelAction).toHaveBeenCalled();
    });

    it('should be deleteAction', () => {
      component.isConfirm = true;
      fixture.detectChanges();
      const cancelButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__confirmation-button_confirm'),
      )?.nativeElement;
      expect(cancelButton?.innerHTML?.trim()).toBe('Удалить');
      jest.spyOn(component, 'deleteAction');
      cancelButton?.click();
      fixture.detectChanges();
      expect(component.deleteAction).toHaveBeenCalled();
    });
  });

  describe('toolbar', () => {
    it('should be zoomIn action', () => {
      component.zoom.next({ zoom: 0, max: 5 });
      fixture.detectChanges();
      const zoomButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__toolbar-action.zoom-in'),
      )?.nativeElement;
      jest.spyOn(component, 'zoomIn');
      zoomButton?.click();
      fixture.detectChanges();
      expect(component.zoomIn).toHaveBeenCalled();
      component.zoom.next({ zoom: 5, max: 5 });
      fixture.detectChanges();
      expect(zoomButton.disabled).toBe(true);
      expect(zoomButton.hidden).toBe(true);
    });

    it('should be zoomOut action', () => {
      component.zoom.next({ zoom: 0, max: 5 });

      fixture.detectChanges();
      const zoomButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__toolbar-action.zoom-out'),
      )?.nativeElement;
      jest.spyOn(component, 'zoomOut');
      zoomButton?.click();
      fixture.detectChanges();
      expect(component.zoomOut).toHaveBeenCalled();
      component.isError = true;
      fixture.detectChanges();
      expect(zoomButton.disabled).toBe(true);
      expect(zoomButton.hidden).toBe(true);
    });

    it('should be remove action', () => {
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__toolbar-action.suggest-action'),
      )?.nativeElement;
      jest.spyOn(component, 'confirmAction');
      button?.click();
      fixture.detectChanges();
      expect(component.confirmAction).toHaveBeenCalled();
    });

    it('should be not remove action for readonly', () => {
      component.readonly = true;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.viewer__toolbar-action.suggest-action')),
      ).toBeNull();
    });

    it('should be counter', () => {
      expect(
        fixture.debugElement.query(By.css('.viewer__toolbar-counter'))?.nativeElement?.innerHTML,
      ).toBe('1/1');
    });

    it('should be attach action', () => {
      component.type = FilesCollection.suggest;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__toolbar-action.attach'),
      )?.nativeElement;
      jest.spyOn(component, 'suggestAction');
      button?.click();
      fixture.detectChanges();
      expect(component.suggestAction).toHaveBeenCalledWith(true);
      component.isError = true;
      fixture.detectChanges();
      expect(button.disabled).toBeTruthy();
    });

    it('should be not attach action for readonly', () => {
      component.type = FilesCollection.suggest;
      component.readonly = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.viewer__toolbar-action.attach'))).toBeNull();
    });

    it('should be detach action', () => {
      component.type = FilesCollection.suggest;
      component.item.setAttached(true);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.viewer__toolbar-action.detach'),
      )?.nativeElement;
      jest.spyOn(component, 'suggestAction');
      button?.click();
      fixture.detectChanges();
      expect(component.suggestAction).toHaveBeenCalledWith(false);
      component.isError = true;
      fixture.detectChanges();
      expect(button.disabled).toBeTruthy();
    });

    it('should be not detach action for readonly', () => {
      component.type = FilesCollection.suggest;
      component.readonly = true;
      component.item.setAttached(true);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.viewer__toolbar-action.detach'))).toBeNull();
    });
  });
});
