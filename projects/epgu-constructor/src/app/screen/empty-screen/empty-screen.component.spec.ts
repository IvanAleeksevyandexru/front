import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyScreenComponent } from './empty-screen.component';
import { ScreenService } from '../screen.service';
import { MockComponent } from 'ng-mocks';
import { ScreenServiceStub } from '../screen.service.stub';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';
import { RedirectComponent } from '../../component/empty-screen/components/redirect.component';
import { By } from '@angular/platform-browser';

// TODO: Need to refactoring component
describe('EmptyScreenComponent', () => {
  let component: EmptyScreenComponent;
  let fixture: ComponentFixture<EmptyScreenComponent>;

  let screenService: ScreenServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyScreenComponent, MockComponent(RedirectComponent)],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyScreenComponent);
    component = fixture.componentInstance;
    // screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();

    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('emptyComponentName property', () => {
    it('should be EmptyScreenComponentTypes by default', () => {
      expect(component.emptyComponentName).toBe(EmptyScreenComponentTypes);
    });
  });

  describe('redirectLink() getter', () => {
    it('should return link from ref if ref exists', () => {
      screenService.applicantAnswers = {
        ref1: {
          visited: true,
          value: 'http://example.com',
        },
      };
      screenService.component = {
        attrs: {
          ref: 'ref1',
        },
        id: 'id1',
        type: 'type1',
      };

      expect(component.redirectLink).toBe('http://example.com');
    });

    it('should return link from component if ref does not exist', () => {
      screenService.component = {
        attrs: {
          link: 'http://example.com',
        },
        id: 'id1',
        type: 'type1',
      };

      expect(component.redirectLink).toBe('http://example.com');
    });

    it('should return NULL if link is not in ref or in component', () => {
      screenService.component = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      };

      expect(component.redirectLink).toBeUndefined();
    });
  });

  it('should render epgu-constructor-redirect', () => {
    const selector = 'epgu-constructor-redirect';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = EmptyScreenComponentTypes.redirect;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.link).toBeUndefined();

    jest.spyOn(component, 'redirectLink', 'get').mockReturnValue('http://example.com');
    fixture.detectChanges();

    expect(debugEl.componentInstance.link).toBe('http://example.com');
  });
});
