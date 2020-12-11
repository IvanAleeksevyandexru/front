import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentBase } from '../../../../screen/screen.types';
import { of } from 'rxjs';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

// TODO: Need to refactoring component
xdescribe('FileUploadScreenComponent', () => {
  let component: FileUploadScreenComponent;
  let fixture: ComponentFixture<FileUploadScreenComponent>;
  let mockData: ComponentBase = {
    attrs: {
      uploads: [
        {
          uploadId: '1',
          label: '',
          fileType: 'txt',
          maxFileCount: '1',
          maxSize: '42',
        },
      ],
    },
    id: '',
    label: '',
    type: '',
    value: '',
  } as ComponentBase;
  let screenService: ScreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [FileUploadScreenComponent],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    }).compileComponents();
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    screenService.component$ = of(mockData);
    screenService.header$ = of('');
    screenService.submitLabel$ = of('');
    fixture = TestBed.createComponent(FileUploadScreenComponent);
    component = fixture.componentInstance;
    Z;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
