import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';


xdescribe('InfoComponentModalComponent', () => {
  let component: InfoComponentModalComponent;
  let fixture: ComponentFixture<InfoComponentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoComponentModalComponent],
      providers: [
        { provide: ScreenService,useClass: ScreenServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponentModalComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(ScreenService);

    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
