import { TestBed } from '@angular/core/testing';
import { ComponentsListToolsService } from './components-list-tools.service';
import { CustomComponent, CustomScreenComponentTypes } from '../../components-list.types';
import { ForTestsOnlyModule } from '../../../../core/for-tests-only.module';

describe('ComponentsListToolsService', () => {
  let service: ComponentsListToolsService;
  const mockComponent: CustomComponent = {
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
      imports: [ForTestsOnlyModule],
    });
    service = TestBed.inject(ComponentsListToolsService);
  });

  describe('convertedValue()', () => {
    it('should call parseValue()', () => {
      const parseValueSpy = jest.spyOn<any, string>(service, 'parseValue');
      service.convertedValue(mockComponent);
      expect(parseValueSpy).toHaveBeenCalled();
    });

    it('parseValue should parse date', () => {
      const dat = service['parseValue'](
        '02.07.2021',
        true,
        CustomScreenComponentTypes.DateInput,
      ) as Date;
      expect(dat.toDateString()).toEqual('Fri Jul 02 2021');
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
      component.value =
        // eslint-disable-next-line max-len
        '{"region":"Башкортостан","city":"","district":"Учалинский","town":"Рысаево","inCityDist":"","street":"Башкортостан","additionalArea":"","additionalStreet":"","house":"","houseCheckbox":true,"houseCheckboxClosed":true,"building1":"","building2":"","apartment":"","apartmentCheckbox":false,"apartmentCheckboxClosed":false,"index":"453722","geoLat":"54.4767414","geoLon":"59.3850825","fullAddress":"453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан","addressStr":"Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан","lat":"54.4767414","lng":"59.3850825","fiasCode":"1aae9505-d61a-40a4-a5ce-b0397e8275b2","okato":"80253825002","hasErrors":0,"kladrCode":"02046000074001200","regionCode":"02"}';
      expect(service.convertedValue(component)).toBe(
        '453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан',
      );
    });
    it('should return origin value string, if json address value is not parsable', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.type = CustomScreenComponentTypes.AddressInput;
      component.value = '453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан';
      expect(service.convertedValue(component)).toBe(
        '453722, Респ. Башкортостан, р-н. Учалинский, с. Рысаево, ул. Башкортостан',
      );
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
    it('should return parsed phone number', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.value = '+7(980)7060210';
      expect(service.convertedValue(component)).toEqual('+7 (980) 706 02 10');
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
    it('should return empty string as default value', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.value = undefined;
      expect(service.convertedValue(component)).toEqual('');
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

  describe('isPhone()', () => {
    it('should return true, if is phone number', () => {
      const value = '+7(980)7060210';
      expect(service.isPhone(value)).toBeTruthy();
    });
    it('should return false, if is not phone number', () => {
      const value = '234-234-423 34';
      expect(service.isPhone(value)).toBeFalsy();
    });
    it('should return false, if undefined', () => {
      const value = undefined;
      expect(service.isPhone(value)).toBeFalsy();
    });
    it('should return false, if null', () => {
      const value = null;
      expect(service.isPhone(value)).toBeFalsy();
    });
  });
});
