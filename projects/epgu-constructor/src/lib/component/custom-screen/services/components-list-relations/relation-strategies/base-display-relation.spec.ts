import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { CustomComponent, CustomListStatusElements } from '../../../components-list.types';
import { CustomComponentRefRelation, TimeRelatedValue } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { BaseDisplayRelation } from './base-display-relation';
import { createComponentMock, createComponentMockWithRel } from '../components-list-relations.mock';
import { ConfigService, DatesToolsService, JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { CachedAnswers } from '../../../../../screen/screen.types';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface SetupTestInterface {
  isRelatedComponentShown: boolean;
}

const setupDefaultValue = {
  isRelatedComponentShown: true,
};

const setup = ({ isRelatedComponentShown }: SetupTestInterface = setupDefaultValue) => {
  const dependentComponent: CustomComponent = createComponentMockWithRel('dependent', {
    relatedRel: 'relatedComponent',
    val: true,
    relation: CustomComponentRefRelation.displayOff,
  });

  const relatedComponent: CustomComponent = createComponentMock({
    id: 'relatedComponent',
    value: true,
  });

  const shownElements: CustomListStatusElements = {
    relatedComponent: { isShown: isRelatedComponentShown },
    dependent: { isShown: true },
  };

  const mockForm = new FormArray([
    new FormBuilder().group(dependentComponent),
    new FormBuilder().group(relatedComponent),
  ]);

  const cachedAnswers: CachedAnswers = {
    dependent: { value: 'true', visited: true },
    relatedComponent: { value: 'true', visited: true },
  };

  return { dependentComponent, shownElements, mockForm, cachedAnswers };
};

@Injectable()
class ConcreteDisplayRelation extends BaseDisplayRelation {
  protected isCurrentRelation(_relation: CustomComponentRefRelation): boolean {
    return true;
  }
}

describe('BaseDisplayRelation', () => {
  let relation: BaseDisplayRelation;
  let refRelationService: RefRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConcreteDisplayRelation,
        DatesToolsService,
        MockProvider(ConfigService),
        MockProvider(HttpClient),
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(ConcreteDisplayRelation);
    refRelationService = TestBed.inject(RefRelationService);
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
  });

  describe('isAtLeastOneRelationFired()', () => {
    describe('when related component val is equal related val', () => {
      beforeEach(() => {
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
      });

      it('should be true if at least one ', () => {
        const { dependentComponent, shownElements, mockForm } = setup();

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          shownElements,
          mockForm,
          {},
        );

        expect(result).toBeTruthy();
      });

      it('should be false if related component is hidden', () => {
        const { dependentComponent, shownElements, mockForm } = setup({
          isRelatedComponentShown: false,
        });

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          shownElements,
          mockForm,
          {},
        );

        expect(result).toBeFalsy();
      });

      it('should be true if related component is in cachedAnswers', () => {
        const { dependentComponent, shownElements, cachedAnswers } = setup({
          isRelatedComponentShown: false,
        });
        const mockForm = new FormArray([]);

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          shownElements,
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeTruthy();
      });
    });

    describe('when related component val is NOT equal related val', () => {
      beforeEach(() => {
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
      });

      it('should be false', () => {
        const { dependentComponent, shownElements, mockForm } = setup();

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          shownElements,
          mockForm,
          {},
        );

        expect(result).toBeFalsy();
      });

      it('should be false if related component is hidden', () => {
        const { dependentComponent, shownElements, mockForm } = setup({
          isRelatedComponentShown: false,
        });

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          shownElements,
          mockForm,
          {},
        );

        expect(result).toBeFalsy();
      });
    });

    describe('when there is no related component anywhere', function () {
      const { dependentComponent } = setup({ isRelatedComponentShown: false });
      const mockForm = new FormArray([]);

      it('should act as value === null and return false', () => {
        const result = relation.isAtLeastOneRelationFired(dependentComponent, {}, mockForm, {});

        expect(result).toBeFalsy();
      });

      it('should act as value === null and return true', () => {
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
        const customDependentComponent = createComponentMockWithRel('dependent', {
          relatedRel: 'relatedComponent',
          val: '',
          relation: CustomComponentRefRelation.displayOff,
        });
        const result = relation.isAtLeastOneRelationFired(
          customDependentComponent,
          {},
          mockForm,
          {},
        );

        expect(result).toBeTruthy();
      });
    });

    describe('when displaying depends on timeRelatedValue', function () {
      const mockForm = new FormArray([new FormControl()]);
      const setupForTime = (
        timeString: string,
        relationType: CustomComponentRefRelation,
        timeType: TimeRelatedValue,
      ) => {
        const { dependentComponent, cachedAnswers } = setup({ isRelatedComponentShown: false });
        dependentComponent.attrs.ref = [
          {
            val: timeType,
            relation: relationType,
            relatedRel: 'testTime',
            path: 'test',
          },
        ];
        cachedAnswers.testTime = { value: { test: timeString } as any, visited: false };
        return { dependentComponent, cachedAnswers };
      };

      it('should fire if argument time is after current', () => {
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2200-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeBefore,
        );

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          {},
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeTruthy();
      });

      it('should not fire if argument time is before current', () => {
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2000-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeBefore,
        );

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          {},
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeFalsy();
      });

      it('should fire if argument time is after current', () => {
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2200-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOn,
          TimeRelatedValue.dateTimeBefore,
        );

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          {},
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeTruthy();
      });

      it('should not fire if argument time is before current', () => {
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2000-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeBefore,
        );

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          {},
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeFalsy();
      });

      it('should not fire if argument time is after current', () => {
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2200-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeAfter,
        );

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          {},
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeFalsy();
      });

      it('should fire if argument time is before current', () => {
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2000-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeAfter,
        );

        const result = relation.isAtLeastOneRelationFired(
          dependentComponent,
          {},
          mockForm,
          cachedAnswers,
        );

        expect(result).toBeTruthy();
      });

      it('should call timeout for future updates', () => {
        jest.useFakeTimers();
        const spy = jest.spyOn(global, 'setTimeout');
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2200-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeAfter,
        );

        relation.isAtLeastOneRelationFired(dependentComponent, {}, mockForm, cachedAnswers);

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });

      it('should write ids to hashMap and not to call timeout repeatedly', () => {
        jest.useFakeTimers();
        const spy = jest.spyOn(global, 'setTimeout');
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2200-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeAfter,
        );

        relation.isAtLeastOneRelationFired(dependentComponent, {}, mockForm, cachedAnswers);
        relation.isAtLeastOneRelationFired(dependentComponent, {}, mockForm, cachedAnswers);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(
          relation.timeouts[dependentComponent.id + TimeRelatedValue.dateTimeAfter],
        ).toBeTruthy();
        spy.mockRestore();
      });

      it('should not call timeout ', () => {
        const spy = jest.spyOn(global, 'setTimeout');
        const { dependentComponent, cachedAnswers } = setupForTime(
          '2000-01-31T18:16:13+03:00',
          CustomComponentRefRelation.displayOff,
          TimeRelatedValue.dateTimeAfter,
        );

        relation.isAtLeastOneRelationFired(dependentComponent, {}, mockForm, cachedAnswers);

        expect(spy).toHaveBeenCalledTimes(0);
        jest.useRealTimers();
      });
    });
  });
});
