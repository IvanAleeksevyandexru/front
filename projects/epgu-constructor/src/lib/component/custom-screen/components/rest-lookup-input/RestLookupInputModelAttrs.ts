import { CustomComponentAttr } from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { LogicComponentEventTypes, LogicComponentHeaders } from '@epgu/epgu-constructor-types';

export default class RestLookupInputModelAttrs extends DictionarySharedAttrs {
  readonly hint: string;
  readonly url: string;
  readonly method: string;
  readonly path: string;
  readonly emptyWhenNoFilter: boolean;
  readonly body: string;
  readonly timeout: string;
  readonly headers: LogicComponentHeaders;
  readonly events: LogicComponentEventTypes[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.hint = attrs.hint;
    this.url = attrs.url;
    this.method = attrs.method;
    this.path = attrs.path;
    this.emptyWhenNoFilter = attrs.emptyWhenNoFilter;
    this.body = attrs.body;
    this.timeout = attrs.timeout;
    this.headers = attrs.headers;
    this.events = attrs.events;
  }

}
