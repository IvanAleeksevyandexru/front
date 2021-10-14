import {
  TimerRulesDto,
} from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class TimerItemModelAttrs extends GenericAttrs  {
  readonly startTime: string;
  readonly currentTime?: string;
  readonly expirationTime: string;
  readonly timerRules: TimerRulesDto;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.startTime = attrs.startTime;
    this.currentTime = attrs.currentTime;
    this.expirationTime = attrs.expirationTime;
    this.timerRules = attrs.timerRules;
  }

}
