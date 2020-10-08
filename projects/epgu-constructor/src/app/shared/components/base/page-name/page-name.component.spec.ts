import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNameComponent } from './page-name.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PageNameComponent', () => {
  let component: PageNameComponent;
  let fixture: ComponentFixture<PageNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ PageNameComponent ],
      providers: [
        { provide: ScreenService,useClass: ScreenServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
