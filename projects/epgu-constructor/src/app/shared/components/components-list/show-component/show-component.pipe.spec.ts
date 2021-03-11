import { TestBed } from '@angular/core/testing';
import { ShowComponentPipe } from './show-component.pipe';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { CustomListStatusElements } from '../components-list.types';
import { ComponentsListFormService } from '../../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../../services/components-list-form/components-list-form.service.stub';

describe('ShowComponentPipe', () => {
  let pipe: ShowComponentPipe;
  let formService: ComponentsListFormService;
  let component: ComponentDto;
  let shownElements: CustomListStatusElements;

  const setShownElements = (shownElements: CustomListStatusElements) => {
    formService['_shownElements'] = shownElements;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowComponentPipe],
      providers: [
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    });
  });

  beforeEach(() => {
    component = {
      id: 'a2',
      attrs: {},
      type: 'HtmlString'
    };
    shownElements = {
      a2: {
        isShown: true,
        relation: null
      }
    };
    formService = TestBed.inject(ComponentsListFormService);
    pipe = new ShowComponentPipe(formService);
    setShownElements(shownElements);
  });

  it('should return true when isShown and not hidden', () => {
    const result = pipe.transform(component);
    expect(result).toBeTruthy();
  });

  it('should return false when not isShown and not hidden', () => {
    shownElements.a2.isShown = false;
    setShownElements(shownElements);
    const result = pipe.transform(component);
    expect(result).toBeFalsy();
  });

  it('should return false when isShown and hidden', () => {
    component.attrs.hidden = true;
    const result = pipe.transform(component);
    expect(result).toBeFalsy();
  });

  it('should return false when not isShown and hidden', () => {
    shownElements.a2.isShown = false;
    component.attrs.hidden = true;
    setShownElements(shownElements);
    const result = pipe.transform(component);
    expect(result).toBeFalsy();
  });
});
