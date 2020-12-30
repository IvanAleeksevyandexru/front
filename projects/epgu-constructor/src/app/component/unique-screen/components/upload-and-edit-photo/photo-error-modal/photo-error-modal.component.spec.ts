import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoErrorModalComponent } from './photo-error-modal.component';
import { EpguLibModule } from 'epgu-lib';
import { ConfigService } from '../../../../../core/services/config/config.service';

describe('PhotoErrorModalComponent', () => {
  let component: PhotoErrorModalComponent;
  let fixture: ComponentFixture<PhotoErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EpguLibModule ],
      declarations: [ PhotoErrorModalComponent ],
      providers: [ ConfigService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
