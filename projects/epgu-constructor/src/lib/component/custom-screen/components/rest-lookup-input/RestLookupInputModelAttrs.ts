import {
  EmptyWhenNoFilter,
  Hint,
  LogicComponentEventTypes,
  LogicComponentHeaders,
  LogicComponentMethods,
  Path,
  Timeout,
  Url,
  Body,
} from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';

export default class RestLookupInputModelAttrs extends DictionarySharedAttrs {
  readonly hint: Hint;

  readonly url: Url;

  readonly method: LogicComponentMethods;

  readonly path: Path;

  readonly emptyWhenNoFilter: EmptyWhenNoFilter;

  readonly body: Body;

  readonly timeout: Timeout;

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
