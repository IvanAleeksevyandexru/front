import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniqueComponentModalComponent } from './unique-component-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';

describe('UniqueComponentModalComponent', () => {
  let component: UniqueComponentModalComponent;
  let fixture: ComponentFixture<UniqueComponentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniqueComponentModalComponent],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueComponentModalComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(ScreenService);

    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
