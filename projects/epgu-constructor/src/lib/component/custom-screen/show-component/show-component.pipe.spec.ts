import { TestBed } from '@angular/core/testing';
import { ShowComponentPipe } from './show-component.pipe';
import { CustomListStatusElements } from '../components-list.types';
import { ComponentsListFormService } from '../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../services/components-list-form/components-list-form.service.stub';
import { configureTestSuite } from 'ng-bullet';

describe('ShowComponentPipe', () => {
  let pipe: ShowComponentPipe;
  let formService: ComponentsListFormService;

  const setShownElements = (shownElements: CustomListStatusElements) => {
    formService['_shownElements'] = shownElements;
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ShowComponentPipe],
      providers: [{ provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub }],
    });
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    pipe = new ShowComponentPipe();
  });

  it('should return true when isShown and not hidden', () => {
    const result = pipe.transform(true, false);
    expect(result).toBeTruthy();
  });

  it('should return false when not isShown and not hidden', () => {
    const result = pipe.transform(false, false);
    expect(result).toBeFalsy();
  });

  it('should return false when isShown and hidden', () => {
    const result = pipe.transform(true, true);
    expect(result).toBeFalsy();
  });

  it('should return false when not isShown and hidden', () => {
    const result = pipe.transform(false, true);
    expect(result).toBeFalsy();
  });
});
