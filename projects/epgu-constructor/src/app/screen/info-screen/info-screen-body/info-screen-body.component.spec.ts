import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { InfoScreenBodyComponent } from './info-screen-body.component';
import { MockComponent } from 'ng-mocks';
import { OutputHtmlComponent } from '../../../shared/components/output-html/output-html.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto } from 'epgu-constructor-types';

const mockDataWithAttrs: ComponentDto = {
  id: 'id1',
  type: 'type1',
  attrs: {
    image: {
      src: 'http://example.com/some-image',
      alt: 'some alt',
    },
    clarifications: {
      any: {
        title: 'clarifications-title',
        text: 'clarifications-text',
      },
    },
  },
  label: 'label1',
};

const emptyMockData: ComponentDto = {
  id: 'id1',
  type: 'type1',
  attrs: {},
  label: 'label1',
};

describe('InfoScreenBodyComponent', () => {
  let component: InfoScreenBodyComponent;
  let fixture: ComponentFixture<InfoScreenBodyComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InfoScreenBodyComponent, MockComponent(OutputHtmlComponent)],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
    }).overrideComponent(InfoScreenBodyComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('data property', () => {
    it('should be undefined by default', () => {
      expect(component.data).toBeUndefined();
    });
  });

  it('should render img', () => {
    let img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();

    component.data = emptyMockData;
    fixture.detectChanges();

    img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();

    component.data = mockDataWithAttrs;
    fixture.detectChanges();

    img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();

    expect(img.src).toBe(mockDataWithAttrs.attrs.image.src);
    expect(img.alt).toBe(mockDataWithAttrs.attrs.image.alt);
  });

  it('should render epgu-constructor-output-html', () => {
    const selector = 'epgu-constructor-output-html';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeNull();

    component.data = emptyMockData;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.html).toBe(mockDataWithAttrs.label);
    expect(debugEl.componentInstance.clarifications).toBeUndefined();

    component.data = mockDataWithAttrs;
    fixture.detectChanges();

    expect(debugEl.componentInstance.html).toBe(mockDataWithAttrs.label);
    expect(debugEl.componentInstance.clarifications).toBe(mockDataWithAttrs.attrs.clarifications);
  });
});
