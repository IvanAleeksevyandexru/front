import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  EventBusService,
  FocusManagerService,
  FocusManagerServiceStub,
  InputErrorModule,
  UnsubscribeService,
  MaskHandleModule,
} from '@epgu/epgu-constructor-ui-kit';

import { HealthService } from '@epgu/ui/services/health';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

import { BaseComponentsModule } from '../base-components/base-components.module';
import { ConstructorMaskedInputModule } from '../constructor-masked-input/constructor-masked-input.module';
import { PassportComponent } from './passport.component';

describe('PassportComponent', () => {
  let component: PassportComponent;
  let fixture: ComponentFixture<PassportComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          RouterTestingModule,
          ConstructorMaskedInputModule,
          BaseComponentsModule,
          MaskHandleModule,
          HttpClientTestingModule,
          InputErrorModule,
          ReactiveFormsModule,
        ],
        declarations: [PassportComponent],
        providers: [
          { provide: ScreenService, useClass: ScreenServiceStub },
          { provide: FocusManagerService, useClass: FocusManagerServiceStub },
          UnsubscribeService,
          HealthService,
          EventBusService,
        ],
      })
        .overrideComponent(PassportComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportComponent);
    component = fixture.componentInstance;
    component.attrs = {
      participant: null,
      fields: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('render', () => {
    const selector = '.form__name';

    it('should render default title if attrs does not have "title" or it is empty', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.nativeElement.textContent).toContain(component.DEFAULT_TITLE);

      component.attrs.title = '';
      fixture.detectChanges();

      expect(debugEl.nativeElement.textContent).toContain(component.DEFAULT_TITLE);
    });

    it('should render custom title if attrs have "title"', () => {
      const customTitle = 'Custom title';
      component.attrs.title = customTitle;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.nativeElement.textContent).toContain(customTitle);
    });
  });
});
