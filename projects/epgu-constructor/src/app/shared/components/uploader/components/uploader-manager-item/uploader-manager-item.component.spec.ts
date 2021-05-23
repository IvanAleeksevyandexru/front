import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderManagerItemComponent } from './uploader-manager-item.component';
import { BaseModule } from '../../../../base.module';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import {
  ErrorActions,
  FileItem,
  FileItemError,
  FileItemStatus,
  OperationType,
} from '../../../file-upload/data';
import { By } from '@angular/platform-browser';
import { FileSizePipe, SmuEventsService } from 'epgu-lib';
import { MockModule } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';

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
const createError = (type: ErrorActions, text?: string, description?: string) => {
  return { type, description: description ?? '', text: text ?? '' } as FileItemError;
};

const mockFileItem = (name: string, status?: FileItemStatus, error?: FileItemError) => {
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
  return file;
};

describe('UploaderManagerItemComponent', () => {
  let component: UploaderManagerItemComponent;
  let fixture: ComponentFixture<UploaderManagerItemComponent>;
  let terabyteService: TerraByteApiService;
  let smuService: SmuEventsService;
  let deviceDetectorService: DeviceDetectorService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderManagerItemComponent, FileSizePipe],
      imports: [MockModule(BaseModule)],
      providers: [
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        SmuEventsService,
      ],
    })
      .overrideComponent(UploaderManagerItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderManagerItemComponent);

    terabyteService = TestBed.inject(TerraByteApiService);
    smuService = TestBed.inject(SmuEventsService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);

    component = fixture.componentInstance;
    component.readonly = false;
    jest.spyOn(terabyteService, 'getDownloadApiPath').mockReturnValue('text.txt');
  });

  it('should be upload preview for not error and status uploading', () => {
    component.file = mockFileItem('test.txt', FileItemStatus.uploading);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.upload-preview'))).not.toBeNull();
  });

  it('should be upload preview for not error and status downloading', () => {
    component.file = mockFileItem('test.txt', FileItemStatus.downloading);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.upload-preview'))).not.toBeNull();
  });

  it('should be upload preview for error addDeletionErr', () => {
    component.file = mockFileItem(
      'test.txt',
      FileItemStatus.uploading,
      createError(ErrorActions.addDeletionErr),
    );
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fileType-preview'))).not.toBeNull();
  });

  it('should be upload preview for error addUploadErr', () => {
    component.file = mockFileItem(
      'test.png',
      FileItemStatus.uploading,
      createError(ErrorActions.addUploadErr),
    );
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.photo-preview'))).not.toBeNull();
  });

  it('should be title active for image', () => {
    component.file = mockFileItem('test.png');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.name.active'))).not.toBeNull();
  });

  it('should be title active for pdf', () => {
    component.file = mockFileItem('test.pdf');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.name.active'))).not.toBeNull();
  });

  it('should be title name', () => {
    component.file = mockFileItem('test.pdf');
    fixture.detectChanges();
    expect(
      fixture.debugElement
        .query(By.css('.uploader-manager-item__title > .name'))
        ?.nativeElement?.innerHTML?.trim(),
    ).toBe('test.pdf');
  });

  it('should be size text and description', () => {
    component.file = mockFileItem('test.pdf');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.size'))?.nativeElement?.innerHTML?.trim()).toBe(
      '123 Б',
    );
  });

  it('should be view action for image', () => {
    component.file = mockFileItem('test.png', FileItemStatus.uploaded);
    fixture.detectChanges();
    jest.spyOn(component, 'preview');
    component.viewAction();
    expect(component.preview).toHaveBeenCalled();
  });

  it('should be view action for pdf and webview  = true', () => {
    component.file = mockFileItem('test.pdf', FileItemStatus.uploaded);
    deviceDetectorService.isWebView = true;
    jest.spyOn(smuService, 'notify');
    component.viewAction();
    expect(smuService.notify).toHaveBeenCalled();
  });

  it('should be view action for pdf and webview  = false', () => {
    component.file = mockFileItem('test.pdf', FileItemStatus.uploaded);
    deviceDetectorService.isWebView = false;
    const link: HTMLLinkElement = fixture.debugElement.query(By.css('.link'))?.nativeElement;
    jest.spyOn(link, 'click');
    component.viewAction();
    fixture.detectChanges();
    expect(link.click).toHaveBeenCalled();
  });

  it('should be view button', () => {
    component.file = mockFileItem('test.png', FileItemStatus.uploaded);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.uploader-manager-item__button.view_button'))
      ?.nativeElement;
    expect(button?.innerHTML?.trim()).toBe('Посмотреть');
    jest.spyOn(component, 'viewAction');
    button?.click();
    fixture.detectChanges();
    expect(component.viewAction).toHaveBeenCalled();
  });

  it('should be error text and description', () => {
    component.file = mockFileItem(
      'test.png',
      FileItemStatus.uploaded,
      createError(ErrorActions.addDeletionErr, 'testText', 'testDescription'),
    );
    fixture.detectChanges();
    expect(
      fixture.debugElement
        .query(By.css('.uploader-manager-item__error-text'))
        ?.nativeElement?.innerHTML?.trim(),
    ).toBe('testText');
    const descriptionDiv = fixture.debugElement.query(
      By.css('.uploader-manager-item__error-description'),
    )?.nativeElement?.innerHTML;
    expect(descriptionDiv).not.toBeUndefined();

    expect(descriptionDiv?.indexOf('testDescription')).not.toBe(-1);
  });

  it('should be repeat button for error', () => {
    component.file = mockFileItem(
      'test.png',
      FileItemStatus.uploaded,
      createError(ErrorActions.addUploadErr, 'testText', 'testDescription'),
    );
    fixture.detectChanges();
    const repeatButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('.uploader-manager-item__error-description > .uploader-manager-item__button'),
    )?.nativeElement;
    expect(repeatButton?.innerHTML?.trim()).toBe('Повторить');
  });

  it('should be not repeat button for error and readonly', () => {
    component.file = mockFileItem(
      'test.png',
      FileItemStatus.uploaded,
      createError(ErrorActions.addUploadErr, 'testText', 'testDescription'),
    );
    component.readonly = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('.uploader-manager-item__error-description > .uploader-manager-item__button'),
      ),
    ).toBeNull();
  });

  it('should be remove action', () => {
    component.file = mockFileItem('test.png', FileItemStatus.uploaded);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.remove_button'))).not.toBeNull();
  });

  it('should be not remove action for readonly', () => {
    component.file = mockFileItem('test.png', FileItemStatus.uploaded);
    component.readonly = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.remove_button'))).toBeNull();
  });

  it('should be detach action', () => {
    const file = mockFileItem('test.png', FileItemStatus.uploaded);
    file.setAttached(true);
    component.file = file;
    fixture.detectChanges();
    const detachButton: HTMLButtonElement = fixture.debugElement.query(By.css('.detach_button'))
      ?.nativeElement;
    expect(detachButton).not.toBeUndefined();
    jest.spyOn(component, 'detach');
    detachButton.click();
    fixture.detectChanges();
    expect(component.detach).toHaveBeenCalled();
  });

  it('should be not detach action for readonly', () => {
    const file = mockFileItem('test.png', FileItemStatus.uploaded);
    file.setAttached(true);
    component.file = file;
    component.readonly = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.detach_button'))).toBeNull();
  });

  it('should be cancel action for uploading', () => {
    component.file = mockFileItem('test.png', FileItemStatus.uploading);
    fixture.detectChanges();
    const cancelButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('.uploader-manager-item__action > .uploader-manager-item__button'),
    )?.nativeElement;
    expect(cancelButton?.innerHTML?.trim()).toBe('Отменить');
    jest.spyOn(component, 'cancelAction');
    cancelButton.click();
    fixture.detectChanges();
    expect(component.cancelAction).toHaveBeenCalledWith(OperationType.upload);
  });

  it('should be not cancel action for uploading and readonly', () => {
    component.file = mockFileItem('test.png', FileItemStatus.uploading);
    component.readonly = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('.uploader-manager-item__action > .uploader-manager-item__button'),
      ),
    ).toBeNull();
  });

  it('should be cancel action for downloading', () => {
    component.file = mockFileItem('test.png', FileItemStatus.downloading);
    fixture.detectChanges();
    const cancelButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('.uploader-manager-item__action > .uploader-manager-item__button'),
    )?.nativeElement;
    expect(cancelButton?.innerHTML?.trim()).toBe('Отменить');
    jest.spyOn(component, 'cancelAction');
    cancelButton.click();
    fixture.detectChanges();
    expect(component.cancelAction).toHaveBeenCalledWith(OperationType.download);
  });

  it('should be not cancel action for downloading and readonly', () => {
    component.file = mockFileItem('test.png', FileItemStatus.downloading);
    component.readonly = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('.uploader-manager-item__action > .uploader-manager-item__button'),
      ),
    ).toBeNull();
  });

  it('should be cancel action for deletion', () => {
    component.file = mockFileItem('test.png', FileItemStatus.delition);
    fixture.detectChanges();
    const cancelButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('.uploader-manager-item__action > .uploader-manager-item__button'),
    )?.nativeElement;
    expect(cancelButton?.innerHTML?.trim()).toBe('Отменить');
    jest.spyOn(component, 'cancelAction');
    cancelButton.click();
    fixture.detectChanges();
    expect(component.cancelAction).toHaveBeenCalledWith(OperationType.delete);
  });

  it('should be not cancel action for deletion and readonly', () => {
    component.file = mockFileItem('test.png', FileItemStatus.delition);
    component.readonly = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('.uploader-manager-item__action > .uploader-manager-item__button'),
      ),
    ).toBeNull();
  });
});
