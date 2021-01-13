import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OutputHtmlComponent } from './output-html.component';
import { ModalService } from '../../../modal/modal.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImgPrefixerPipe } from '../../pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../pipes/safe/safe.pipe';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ActionService } from '../../directives/action/action.service';
import { ActionServiceStub } from '../../directives/action/action.service.stub';

describe('OutputHtmlComponent', () => {
  let fixture: ComponentFixture<OutputHtmlComponent>;
  let comp: OutputHtmlComponent;
  let modalService: ModalService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ImgPrefixerPipe, SafePipe, OutputHtmlComponent],
        providers: [
          { provide: ScreenService, useClass: ScreenServiceStub },
          { provide: NavigationService, useClass: NavigationServiceStub },
          { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: ModalService, useClass: ModalServiceStub },
          { provide: ActionService, useClass: ActionServiceStub },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(OutputHtmlComponent);
          comp = fixture.componentInstance;
          modalService = TestBed.inject(ModalService);
        });
    }),
  );

  it('test not hidden html', () => {
    comp.html = '<span id="test"></span>';
    comp.clarifications = { test: {}};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(modalService, 'openModal').and.callThrough();
    div.querySelector('span').click();
    fixture.detectChanges();
    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('test hidden html', () => {
    comp.html = '<span data-hidden-id="test" id="test"></span>';
    comp.clarifications = { test: {}};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(modalService, 'openModal').and.callThrough();
    div.querySelector('span').click();
    fixture.detectChanges();
    expect(modalService.openModal).toHaveBeenCalledTimes(0);
  });
});
