import { Subject } from 'rxjs';

/**
 * Менеджер по управлению события
 */
export class WebcamEventFactory {
  /**
   * Close event of window
   * @param data - data to pass with event
   */
  static closeEvent(data?: any): WebcamEvent {
    return new WebcamEvent(WebcamEventAction.CLOSE, data);
  }
  /**
   * Close event of window
   * @param data - data to pass with event
   */
  static closeAndSaveEvent(data?: any): WebcamEvent {
    return new WebcamEvent(WebcamEventAction.CLOSE_AND_SAVE, data);
  }

  /**
   * Emit user event
   * @param action - title of action
   * @param data - data for event
   */
  static userEvent(action: string, data?: any): WebcamEvent {
    return new WebcamEvent(action, data);
  }
}



/**
 * Типы действий вебкамеры
 */
export class WebcamEventAction {
  public static readonly CLOSE: string = 'close';
  public static readonly CLOSE_AND_SAVE: string = 'close_and_save';
}


/**
 * События для веб камеры
 */
export class WebcamEvents {
  private _events: Subject<any> = new Subject<any>();
  private _events$ = this._events.asObservable();

  /**
   * Возвращает список событий
   */
  public get events() {
    return this._events$;
  }

  /**
   * Вызывает событие закрытия окна
   * @param data - данные для передачи
   */
  close(data?: any) {
    this._events.next(WebcamEventFactory.closeEvent(data));
    this._events.complete();
  }
  /**
   * Вызывает событие закрытия окна и сохранения данных
   * @param data - данные для передачи
   */
  closeAndSave(data?: any) {
    this._events.next(WebcamEventFactory.closeAndSaveEvent(data));
    this._events.complete();
  }

  /**
   * Emit modal event
   * @param event - modal event
   * @param complete - complete event? (close window)
   */
  public push(event: WebcamEvent, complete?: boolean) {
    this._events.next(event);
    if (complete) {
      this._events.complete();
    }
  }
}

/**
 * Объъект события вебкамеры
 */
export class WebcamEvent {
  private _action = '';
  private _data: any = null;

  constructor(action: string, data?: any) {
    this._action = action;
    this._data = data;
  }

  /**
   * Возвращает тип действия
   */
  public get action(): string {
    return this._action;
  }

  /**
   * Устанавливает тип действия
   * @param action - название события
   */
  public set action(action: string) {
    this._action = action;
  }

  /**
   * Получает данные события
   */
  public get data(): any {
    return this._data;
  }

  /**
   * Устанавливает данные события
   * @param data - данные
   */
  public set data(data: any) {
    this._data = data;
  }
}


export const isCloseWebcamEvent = (event: WebcamEvent) =>
  event.action === WebcamEventAction.CLOSE;
export const isCloseAndSaveWebcamEvent = (event: WebcamEvent) =>
  event.action === WebcamEventAction.CLOSE_AND_SAVE;
