import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { FileUploadItemComponent } from './file-upload-item.component';
import { UserInfoLoaderModule } from '../../../../../../shared/components/user-info-loader/user-info-loader.module';

// TODO: дописать тесты
xdescribe('FileUploadItemComponent', () => {
  let component: FileUploadItemComponent;
  let fixture: ComponentFixture<FileUploadItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadItemComponent],
      imports: [UserInfoLoaderModule],
      providers: [EventBusService],
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
