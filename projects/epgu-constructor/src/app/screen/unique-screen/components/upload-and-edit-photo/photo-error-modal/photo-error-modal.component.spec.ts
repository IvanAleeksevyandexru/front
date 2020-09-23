import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoErrorModalComponent } from './photo-error-modal.component';
import { EpguLibModule } from 'epgu-lib';

describe('PhotoErrorModalComponent', () => {
  let component: PhotoErrorModalComponent;
  let fixture: ComponentFixture<PhotoErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EpguLibModule ],
      declarations: [ PhotoErrorModalComponent ]
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
