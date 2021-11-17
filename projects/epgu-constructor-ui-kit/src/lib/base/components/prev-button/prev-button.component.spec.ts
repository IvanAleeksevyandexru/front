import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrevButtonNavigation } from '@epgu/epgu-constructor-types';
import { PrevButtonComponent } from './prev-button.component';
import { PREV_BUTTON_NAVIGATION } from './prev-button.token';
import { By } from '@angular/platform-browser';

@Injectable()
class TestService implements PrevButtonNavigation {
  // eslint-disable-next-line no-empty-function
  prev(): void {}
}

describe('NavigationComponent', () => {
  let component: PrevButtonComponent;
  let fixture: ComponentFixture<PrevButtonComponent>;
  let prevButtonNavigation: PrevButtonNavigation;
  let prevSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrevButtonComponent],
      providers: [{ provide: PREV_BUTTON_NAVIGATION, useClass: TestService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevButtonComponent);
    component = fixture.componentInstance;
    prevButtonNavigation = (TestBed.inject(PREV_BUTTON_NAVIGATION) as unknown) as TestService;
    prevSpy = jest.spyOn(prevButtonNavigation, 'prev');
    fixture.detectChanges();
  });

  describe('clickGoBack()', () => {
    it('should be call prevButtonNavigation.prev when call clickGoBack', () => {
      component.clickGoBack();
      expect(prevSpy).toBeCalled();
    });

    it('should set isLoading in true state, when call clickGoBack', () => {
      component.clickGoBack();
      expect(component.isLoading).toBeTruthy();
    });

    it('should be call prevButtonNavigation.prev when click on prev button', () => {
      const prevButton = fixture.debugElement.query(By.css('.head__left')).nativeElement;
      prevButton.click();
      expect(prevSpy).toBeCalled();
    });
  });

  describe('handleKeyEvent', () => {
    it('should be call clickGoBack after enter press', () => {
      const event = {
        code: 'Enter',
        // eslint-disable-next-line no-empty-function
        preventDefault: () => {},
      };
      jest.spyOn(component, 'clickGoBack');
      component.handleKeyEvent(event as any);
      expect(component.clickGoBack).toHaveBeenCalledWith();
    });

    it('should be call clickGoBack after space press', () => {
      const event = {
        code: 'Space',
        // eslint-disable-next-line no-empty-function
        preventDefault: () => {},
      };
      jest.spyOn(component, 'clickGoBack');
      component.handleKeyEvent(event as any);
      expect(component.clickGoBack).toHaveBeenCalledWith();
    });
  });
});
