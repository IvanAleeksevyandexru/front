import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContainerComponent } from './main-container.component';
import { Component } from '@angular/core';
import { BaseUiModule } from '../../base-ui.module';
import { By } from '@angular/platform-browser';
import { SharedModalModule } from '../../../modal/shared/shared-modal.module';
import { ModalService } from '../../../modal/modal.service';
import { HttpClientModule } from '@angular/common/http';

const textMock = 'Opa gangnam style!!!';

@Component({
  selector: 'epgu-cf-ui-test-content',
  template: `<h2>${textMock}</h2>`,
})
class TestContentComponent {}

@Component({
  template:
    '<epgu-cf-ui-main-container [showLoader]="showLoader"><epgu-cf-ui-test-content></epgu-cf-ui-test-content></epgu-cf-ui-main-container>',
})
class WrapperTestComponent {
  showLoader = true;
}

describe('MainContainerComponent', () => {
  let component: WrapperTestComponent;
  let fixture: ComponentFixture<WrapperTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperTestComponent, TestContentComponent, MainContainerComponent],
      imports: [BaseUiModule, SharedModalModule, HttpClientModule],
      providers: [ModalService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render loader', () => {
    const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
    expect(throbber.attributes.size).toBe('big');
  });

  it('should render content component', () => {
    component.showLoader = false;
    fixture.detectChanges();
    const contentComponentEl = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(contentComponentEl.textContent).toBe(textMock);
  });

  it('should render modal container', () => {
    const modalContainer = fixture.debugElement.query(By.css('epgu-cf-ui-modal-container'));
    expect(modalContainer).toBeTruthy();
  });
});
