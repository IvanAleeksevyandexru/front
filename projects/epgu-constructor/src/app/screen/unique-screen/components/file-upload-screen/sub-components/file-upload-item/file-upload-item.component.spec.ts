import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../../../config/config.service';
import { ConfigServiceStub } from '../../../../../../config/config.service.stub';
import { FileUploadItemComponent } from './file-upload-item.component';


// TODO: Need to refactoring component
xdescribe('FileUploadItemComponent', () => {
  let component: FileUploadItemComponent;
  let fixture: ComponentFixture<FileUploadItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadItemComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
