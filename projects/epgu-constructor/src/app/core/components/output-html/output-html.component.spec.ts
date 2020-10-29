import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutputHtmlComponent } from './output-html.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenTypes } from '../../../screen/screen.types';
import { ModalService } from '../../../modal/modal.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';

xdescribe('OutputHtmlComponent', () => {
  let component: OutputHtmlComponent;
  let fixture: ComponentFixture<OutputHtmlComponent>;
  let screenService: ScreenService;
  const screenDataMock = {
    componentData: {
      components: [],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: ScreenTypes.QUESTION
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OutputHtmlComponent],
      providers: [
        ScreenService,
        { provide: ModalService, useClass: ModalServiceStub }
      ]
    })
      .compileComponents();
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
