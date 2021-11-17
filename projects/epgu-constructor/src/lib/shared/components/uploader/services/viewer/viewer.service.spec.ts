import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploaderViewerComponent } from '../../components/uploader-viewer/uploader-viewer.component';
import { ViewerService } from './viewer.service';
import { UploaderViewerContentComponent } from '../../components/uploader-viewer-content/uploader-viewer-content.component';
import { ZoomModule } from '../../../zoom/zoom.module';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy, ComponentRef, EventEmitter, Type } from '@angular/core';
import { BaseModule } from '../../../../base.module';
import { FilesCollection, SuggestAction } from '../../data';
import { BehaviorSubject, of } from 'rxjs';
import { FileItem, FileItemStatus } from '../../../file-upload/data';
import {
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { By } from '@angular/platform-browser';
import { MockComponent, MockModule } from 'ng-mocks';
import { take } from 'rxjs/operators';

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

const mockFileItem: () => FileItem = () =>
  new FileItem(FileItemStatus.uploaded, '', null, createUploadedFileMock());

describe('ViewerService', () => {
  let component: UploaderViewerComponent;
  let fixture: ComponentFixture<UploaderViewerComponent>;
  let modalService: ModalService;
  let viewerService: ViewerService;
  const collection = [mockFileItem(), mockFileItem()];
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderViewerComponent, MockComponent(UploaderViewerContentComponent)],
      imports: [MockModule(ZoomModule), MockModule(BaseModule)],
      providers: [
        ViewerService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    })
      .overrideComponent(UploaderViewerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    modalService = TestBed.inject(ModalService);
    viewerService = TestBed.inject(ViewerService);
    fixture = TestBed.createComponent(UploaderViewerComponent);
    component = fixture.componentInstance;
    jest.spyOn(modalService, 'createModal').mockImplementation(
      <R, K = any>(modalComponent: Type<R>, modalParameters?: K): ComponentRef<R> => {
        Object.keys(modalParameters).forEach(
          (key) => (fixture.componentInstance[key] = modalParameters[key]),
        );
        fixture.detectChanges();
        return ({
          instance: fixture.componentInstance,
          // eslint-disable-next-line no-empty-function
          destroy: () => {},
        } as unknown) as ComponentRef<R>;
      },
    );
  });

  it('should be open', () => {
    const viewer = viewerService
      .open(FilesCollection.uploader, 'test', of([mockFileItem()]))
      .subscribe();
    fixture.detectChanges();
    expect(
      fixture.debugElement
        .query(By.css('.modal__title'))
        ?.nativeElement?.innerHTML?.trim()
        ?.indexOf('Просмотр фото'),
    ).not.toBe(-1);
    viewer.unsubscribe();
  });

  it('should be auto close without items', (done) => {
    viewerService.result.pipe(take(1)).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
    viewerService.open(FilesCollection.uploader, 'test', of([])).subscribe();
    fixture.detectChanges();
  });

  it('should getIndex by collection', () => {
    expect(viewerService.getIndex(collection[1].id, collection)).toBe(1);
  });

  it('should get Index by collection with unknown id equal 0', () => {
    expect(viewerService.getIndex('', collection)).toBe(0);
  });

  it('should checkIndex equal false and select by id for first run', () => {
    const selectedIndex = new BehaviorSubject(0);
    const index = null;
    const id = collection[1].id;
    expect(viewerService.checkIndex(collection, index, selectedIndex, id)).toBeFalsy();
    expect(selectedIndex.getValue()).toBe(1);
  });

  it('should checkIndex equal false and next end for index < 0', () => {
    const selectedIndex = new BehaviorSubject(0);
    const index = -1;
    expect(viewerService.checkIndex(collection, index, selectedIndex, '')).toBeFalsy();
    expect(selectedIndex.getValue()).toBe(1);
  });

  it('should checkIndex equal false and next for index > collection.length', () => {
    const selectedIndex = new BehaviorSubject(0);
    const index = 2;
    expect(viewerService.checkIndex(collection, index, selectedIndex, '')).toBeFalsy();
    expect(selectedIndex.getValue()).toBe(0);
  });

  it('should checkIndex equal true and normal next', () => {
    const selectedIndex = new BehaviorSubject(0);
    const index = 1;
    expect(viewerService.checkIndex(collection, index, selectedIndex, '')).toBeTruthy();
  });
  it('should checkIndex equal true and normal next', () => {
    const selectedIndex = new BehaviorSubject(0);
    const index = 1;
    expect(viewerService.checkIndex(collection, index, selectedIndex, '')).toBeTruthy();
  });
  it('should be suggestAction', (done) => {
    const suggests = new EventEmitter<SuggestAction>();
    const viewer = viewerService
      .open(FilesCollection.uploader, 'test', of(collection), suggests)
      .subscribe();
    const action = {
      file: collection[0],
      isAdd: false,
    };
    suggests.subscribe((suggest: SuggestAction) => {
      expect(suggest).toEqual(action);
      done();
    });
    fixture.componentInstance.suggest.emit(action);
    fixture.detectChanges();
    viewer.unsubscribe();
  });

  it('should be deleteAction', (done) => {
    const remove = new EventEmitter<FileItem>();
    const viewer = viewerService
      .open(
        FilesCollection.uploader,
        'test',
        of(collection),
        new EventEmitter<SuggestAction>(),
        remove,
      )
      .subscribe();
    remove.subscribe((file: FileItem) => {
      expect(file).toEqual(collection[0]);
      done();
    });

    component.delete.emit(collection[0]);

    fixture.detectChanges();
    viewer.unsubscribe();
  });

  it('should be downloadAction', (done) => {
    const download = new EventEmitter<FileItem>();
    const viewer = viewerService
      .open(
        FilesCollection.uploader,
        'test',
        of(collection),
        new EventEmitter<SuggestAction>(),
        new EventEmitter<FileItem>(),
        download,
      )
      .subscribe();
    download.subscribe((file: FileItem) => {
      expect(file).toEqual(collection[0]);
      done();
    });

    component.download.emit(collection[0]);

    fixture.detectChanges();
    viewer.unsubscribe();
  });
});
