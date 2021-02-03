import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoErrorModalComponent } from './photo-error-modal.component';
import { ButtonComponent } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';

import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';

describe('PhotoErrorModalComponent', () => {
  let component: PhotoErrorModalComponent;
  let fixture: ComponentFixture<PhotoErrorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoErrorModalComponent, MockComponent(ButtonComponent)],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be create', () => {
    expect(component).toBeTruthy();
  });
});
