import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';

import { ButtonComponent } from '@epgu/ui/base';
import { PhotoErrorModalComponent } from './photo-error-modal.component';

describe('PhotoErrorModalComponent', () => {
  let component: PhotoErrorModalComponent;
  let fixture: ComponentFixture<PhotoErrorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoErrorModalComponent, MockComponent(ButtonComponent)],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be close modal', () => {
    jest.spyOn(component, 'closeModal');
    jest.spyOn(component.modalResult, 'next');
    component.detachView = () => null;
    component.choseAnotherPhoto();
    expect(component.modalResult.next).toHaveBeenCalledWith({ changeImage: true });
    expect(component.closeModal).toHaveBeenCalled();
  });
});
