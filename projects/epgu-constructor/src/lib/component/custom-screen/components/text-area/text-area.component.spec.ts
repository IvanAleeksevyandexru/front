import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockProvider } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { TextAreaComponent } from './text-area.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ConstructorMultilineInputComponent } from '../../../../shared/components/constructor-multiline-input/constructor-multiline-input.component';

describe('TextAreaComponent', () => {
  let component: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TextAreaComponent,
        MockComponents(ComponentItemComponent, ConstructorMultilineInputComponent),
      ],
      providers: [
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(TextAreaComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should render epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });
});
