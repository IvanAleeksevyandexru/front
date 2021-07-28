import { MultipleSelectedItems }
  from 'projects/epgu-constructor/src/lib/shared/components/multiple-choice-dictionary/multiple-choice-dictionary.models';

export interface EquipmentChoiceComponentAttrsResult {
  items: EquipmentChoiceItem[];
  attrs?: {[key: string]: unknown};
}
export interface EquipmentChoiceItem {
  value: string;
  title: string;
  attributeValues: {[key: string]: string | number}
  props?: {[key: string]: string | number}
}
export interface EquipmentChoiceCategory {
  id: number;
  name: string;
  minAmount?: number;
  equipment: EquipmentChoiceItem[];
}

export interface EquipmentItemProps {
  regNumber?: string;
  factoryNumber?: string;
}

export interface EquipmentFormValue {
  [key: string]: {
    [key: string]: EquipmentItemProps | MultipleSelectedItems;
  }
}

export interface EquipmentChoiceUpdateEvent {
  value: EquipmentFormValue;
  isValid: boolean;
}

export class EquipmentChoiceRequestResult {
  categories: {[key: string]: EquipmentChoiceCategory} = {};
  attrs?: {[key: string]: unknown};

  constructor(data: object) {
    data && this.deserialize(data);
  }

  private deserialize(data: object): void{
    const rawValue = data as EquipmentChoiceComponentAttrsResult;

    // Создаём лист категорий
    rawValue.items.forEach((item) => {
      const categoryId = item.attributeValues.CATEGORY_ID;
      const categoryName = item.attributeValues.CATEGORY_NAME;

      this.categories[categoryId] = {
        id: Number(categoryId),
        name: categoryName as string,
        equipment: [],
        minAmount: null,
      };
    });

    // Распределяем оборудование по категориям
    rawValue.items.forEach((item) => {
      this.categories[item.attributeValues.CATEGORY_ID].equipment.push(item);

      /**
       * Если в справочнике задано обязательное минимальное количество
       * оборудования для выбора в данной категории, то одинаковое значение будет лежать
       * в attributeValues каждого оборудования этой категории
       *  */
      if (
        item.attributeValues.MIN_AMOUNT_EQUIPMENT &&
        this.categories[item.attributeValues.CATEGORY_ID].minAmount === null
      ) {
        this.categories[item.attributeValues.CATEGORY_ID].minAmount =
          item.attributeValues.MIN_AMOUNT_EQUIPMENT as number;
      }
    });

    /**
     * Тут вся дополнительная информация по результатам запросов.
     * Cейчас в attrs только массив с CONC_SERVICE_TYPE_ID работ
     * для которых есть обязательное предвыбранное оборудование
     */
    this.attrs = rawValue.attrs;
  }
}

export class EquipmentChoiceFormValue {
  constructor(data: string) {
    data && this.deserialize(data);
  }

  /**
   * Собираем данные в формат для формы
   */
  private deserialize(data: string): void {
    const rawValue = JSON.parse(data);

    (rawValue as EquipmentChoiceSaveValue).categories.forEach((category) => {
      this[category.id] = {
        equipment: null
      };

      if (category.amount && category.amount > 0) {
        this[category.id].equipment = {
          amount: category.amount,
          list: category.list,
        };
      };
    });
  }
}

interface EquipmentChoiceSaveValueCategory extends MultipleSelectedItems {
  id: string;
}

export class EquipmentChoiceSaveValue {
  categories: EquipmentChoiceSaveValueCategory[] = [];
  amount: number;

  constructor(data: EquipmentFormValue) {
    data && this.serialize(data);
  }

  /**
   * Собираем данные в формат для сохранения в applicantAnswers
   */
  private serialize(data: EquipmentFormValue): void {
    Object.keys(data).forEach((key) => {
      const categoryList = data[key].equipment as MultipleSelectedItems;

      this.categories.push({
        id: key,
        list: (categoryList && categoryList.list) || [],
        amount: (categoryList && categoryList.amount) || 0,
      });
      this.amount = this.categories.length;

      Object.keys(data[key]).forEach((iKey) => {
        if (iKey !== 'equipment' && categoryList.list) {
          const item = categoryList.list.find((i) => i.id === iKey);

          if (item) item.originalItem.props = data[key][iKey];
        }
      });
    });
  }
}
