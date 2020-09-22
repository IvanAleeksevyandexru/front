import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutputHtmlComponent } from './output-html.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenTypes } from '../../../screen/screen.types';
import { ModalService } from '../../../services/modal/modal.service';
import { ModalServiceStub } from '../../../services/modal/modal.service.stub';

describe.skip('OutputHtmlComponent', () => {
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
});
