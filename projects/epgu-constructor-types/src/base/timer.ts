/**
 * Секция сведения о заголовка исходя из вмерени
 */
import { ComponentActionDto } from './component-action-dto';

export interface TimerLabelSection {
  label: string;
  fromTime: number;
}

/**
 * Интерфейс для кнопки таймера с последующим переходом
 */
export interface TimerComponentDtoAction extends ComponentActionDto {
  fromTime?: number;
  toTime?: number;
}
