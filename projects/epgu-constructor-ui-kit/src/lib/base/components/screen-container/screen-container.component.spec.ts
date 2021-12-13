import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { CoreModule } from '@epgu/epgu-constructor/src/lib/core/core.module';
import { CoreUiModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { ScreenServiceStub } from '@epgu/epgu-constructor/src/lib/screen/screen.service.stub';
import { PrevButtonModule } from '../prev-button/prev-button.module';
import { ScreenContainerComponent } from './screen-container.component';

describe('ScreenContainerComponent', () => {
  let component: ScreenContainerComponent;
  let fixture: ComponentFixture<ScreenContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MockModule(CoreUiModule), CoreModule, PrevButtonModule],
        declarations: [ScreenContainerComponent],
        providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
      })
        .overrideComponent(ScreenContainerComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('@Input "show-nav"', () => {
    const selector = '.form-player__navigation';

    it('should render prev button if "show-nav" is true', () => {
      component.showNav = true;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should not render prev button if "show-nav" is false', () => {
      component.showNav = false;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();
    });
  });
});
