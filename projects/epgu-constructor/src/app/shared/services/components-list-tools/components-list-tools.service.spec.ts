import { TestBed } from '@angular/core/testing';
import { ComponentsListToolsService } from './components-list-tools.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { CustomComponent, CustomScreenComponentTypes } from '../../components/components-list/components-list.types';

describe('ComponentsListToolsService', () => {
  let service: ComponentsListToolsService;
  let mockComponent: CustomComponent = {
    id: 'rf1',
    type: CustomScreenComponentTypes.StringInput,
    label: 'Прежняя фамилия',
    attrs: {
      fields: [],
      validation: [],
    },
    value: 'value',
    required: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentsListToolsService,
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ComponentsListToolsService);
  });

  describe('convertedValue()', () => {
    it('should call parseValue()', () => {
      const parseValueSpy = spyOn(service, 'parseValue');
      service.convertedValue(mockComponent);
      expect(parseValueSpy).toHaveBeenCalled();
    });
    it('should return Date object, if date string value passed', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.DateInput;
      component.value = '2020.12.12';
      expect(service.convertedValue(component)).toBeInstanceOf(Date);
    });
    it('should return fullAddress string, if json address value passed', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.AddressInput;
      // eslint-disable-next-line max-len
      component.value = '{"region":"Башкортостан","city":"","district":"Учалинский","town":"Рысаево","inCityDist":"","street":"Башкортостан","additionalArea":"","additionalStreet":"","house":"","houseCheckbox":true,"houseCheckboxClosed":true,"building1":"","building2":"","apartment":"","apartmentCheckbox":false,"apartmentCheckboxClosed":false,"index":"453722","geoLat":"54.4767414","geoLon":"59.3850825","fullAddress":"453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан","addressStr":"Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан","lat":"54.4767414","lng":"59.3850825","fiasCode":"1aae9505-d61a-40a4-a5ce-b0397e8275b2","okato":"80253825002","hasErrors":0,"kladrCode":"02046000074001200","regionCode":"02"}';
      expect(service.convertedValue(component)).toBe('453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан');
    });
    it('should return origin value string, if json address value is not parsable', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.AddressInput;
      component.value = '453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан';
      expect(service.convertedValue(component)).toBe('453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан');
    });
    it('should return parsed ListItem value, if json value passed', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.DropDown;
      component.value = '{"id": "id", "text": "text"}';
      const result = { id: 'id', text: 'text' };
      expect(service.convertedValue(component)).toEqual(result);
    });
    it('should return string value as is, if json value is not parsable', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.DropDown;
      const result = '"id": "id", "text": "text"';
      component.value = result;
      expect(service.convertedValue(component)).toEqual(result);
    });
    it('should return boolean, if CheckBox type passed and string value', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.CheckBox;
      component.value = 'true';
      expect(service.convertedValue(component)).toEqual(true);
    });
    it('should return string value, if string value passed', () => {
      const component = mockComponent;
      expect(service.convertedValue(component)).toBe('value');
    });
    it('should return default value, if component value is undefined', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.value = '';
      component.attrs.defaultValue = 'value';
      expect(service.convertedValue(component)).toBe('value');
    });
    it('should return value as is, if nothing above', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      const result = new Date();
      component.value = result;
      expect(service.convertedValue(component)).toEqual(result);
    });
  });

  describe('isAddress()', () => {
    it('should return true, if is AddressInput type', () => {
      const type = CustomScreenComponentTypes.AddressInput;
      expect(service.isAddress(type)).toBeTruthy();
    });
    it('should return false, if is not AddressInput type', () => {
      const type = CustomScreenComponentTypes.DateInput;
      expect(service.isAddress(type)).toBeFalsy();
    });
    it('should return false, if undefined', () => {
      const type = undefined;
      expect(service.isAddress(type)).toBeFalsy();
    });
  });

  describe('isJsonType()', () => {
    it('should return true, if one of json type passed', () => {
      const type = CustomScreenComponentTypes.DocInput;
      expect(service.isJsonType(type)).toBeTruthy();
    });
    it('should return false, if not json type passed', () => {
      const type = CustomScreenComponentTypes.MvdGiac;
      expect(service.isJsonType(type)).toBeFalsy();
    });
    it('should return false, if undefined', () => {
      const type = undefined;
      expect(service.isJsonType(type)).toBeFalsy();
    });
  });

  describe('isCheckBox()', () => {
    it('should return true, if is CheckBox type', () => {
      const type = CustomScreenComponentTypes.CheckBox;
      expect(service.isCheckBox(type)).toBeTruthy();
    });
    it('should return false, if is not CheckBox type', () => {
      const type = CustomScreenComponentTypes.DateInput;
      expect(service.isCheckBox(type)).toBeFalsy();
    });
    it('should return false, if undefined', () => {
      const type = undefined;
      expect(service.isCheckBox(type)).toBeFalsy();
    });
  });

  describe('isDate()', () => {
    it('should return true, if is DateInput type', () => {
      const type = CustomScreenComponentTypes.DateInput;
      expect(service.isDate(type)).toBeTruthy();
    });
    it('should return false, if is not DateInput type', () => {
      const type = CustomScreenComponentTypes.CheckBox;
      expect(service.isDate(type)).toBeFalsy();
    });
    it('should return false, if undefined', () => {
      const type = undefined;
      expect(service.isDate(type)).toBeFalsy();
    });
  });
});
