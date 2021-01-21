import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafePipe } from '../../pipes/safe/safe.pipe';
import { FieldListComponent } from './field-list.component';
import { ImgPrefixerPipe } from '../../pipes/img-prefixer/img-prefixer.pipe';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';

describe('FieldListComponent', () => {
  let component: FieldListComponent;
  let fixture: ComponentFixture<FieldListComponent>;
  const dataMock = {
    attrs: {
      style: {},
    },
    visited: true,
    label: '',
    type: '',
    value: '',
    id: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldListComponent, SafePipe, ImgPrefixerPipe],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldListComponent);
    component = fixture.componentInstance;
    component.data = dataMock as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
