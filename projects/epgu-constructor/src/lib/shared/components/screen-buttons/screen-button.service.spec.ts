import { TestBed } from '@angular/core/testing';
import { DeviceDetectorService, DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { ComponentsListRelationsServiceStub } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service.stub';
import { ScreenButtonService } from './screen-button.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { FormArray } from '@angular/forms';

const mockButtons = [
  {
    id: 'test',
    attrs: {
      ref: [
        {
          relatedRel: 'schoolList',
          val: 'dateTimeBefore',
          path: 'originalItem.attributeValues.REG_START_DATE',
          relation: 'disableButton',
        },
      ],
    },
  },
  {
    id: 'test1',
    attrs: {
      ref: [
        {
          relatedRel: 'schoolList',
          val: 'dateTimeBefore',
          path: 'originalItem.attributeValues.REG_START_DATE',
          relation: 'disableButton',
        },
      ],
    },
  },
];

describe('ScreenButtonService', () => {
  let service: ScreenButtonService;
  let screenService: ScreenService;
  let relationService: ComponentsListRelationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenButtonService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ScreenButtonService);
    screenService = TestBed.inject(ScreenService);
    relationService = TestBed.inject(ComponentsListRelationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initSubscribeOnComponentsForm', () => {
    it('should hide button depending on their relations field', () => {
      jest
        .spyOn(relationService, 'calculateVisibility')
        .mockReturnValue({ test: { isShown: false }, test1: { isShown: true } });
      screenService.buttons = (mockButtons as unknown) as ScreenButton[];

      service.initSubscribeOnComponentsForm(new FormArray([]), {});

      expect(service.outputButtons[0].hidden).toBeTruthy();
      expect(service.outputButtons[1].hidden).toBeFalsy();
    });

    it('should call visibility calculation on form change', () => {
      const spy = jest.spyOn(relationService, 'calculateVisibility').mockReturnValue({});
      const form = new FormArray([]);
      screenService.buttons = (mockButtons as unknown) as ScreenButton[];
      service.initSubscribeOnComponentsForm(form, {});

      form.updateValueAndValidity({ onlySelf: false, emitEvent: true });

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('initButtonsDisablingHandling', () => {
    it('should disable button depending on relations service result', () => {
      const spy = jest.spyOn(relationService, 'calculateDisabling').mockReturnValue(true);

      service.initButtonsDisablingHandling(mockButtons as any);

      expect(service.outputButtons.every((b) => b.disabledByRel));
    });

    it('should set new buttons on first call', () => {
      jest.spyOn(relationService, 'calculateDisabling').mockReturnValue(true);
      const spy = jest.spyOn(service, 'outputButtons', 'set');

      service.initButtonsDisablingHandling(mockButtons as any);

      expect(spy).toHaveBeenCalled();
    });

    it('should set new buttons only once', () => {
      jest.spyOn(relationService, 'calculateDisabling').mockReturnValue(true);
      const spy = jest.spyOn(service, 'outputButtons', 'set');

      service.initButtonsDisablingHandling(mockButtons as any);
      service.initButtonsDisablingHandling(mockButtons as any);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
