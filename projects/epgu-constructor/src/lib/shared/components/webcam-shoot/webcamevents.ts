import { Observable, Subject } from 'rxjs';

/**
 * Менеджер по управлению события
 */
export class WebcamEventFactory {
  /**
   * Close event of window
   * @param data - data to pass with event
   */
  static closeEvent(data?: string): WebcamEvent {
    return new WebcamEvent(WebcamEventAction.CLOSE, data);
  }
  /**
   * Close event of window
   * @param data - data to pass with event
   */
  static closeAndSaveEvent(data?: string): WebcamEvent {
    return new WebcamEvent(WebcamEventAction.CLOSE_AND_SAVE, data);
  }

  /**
   * Emit user event
   * @param action - title of action
   * @param data - data for event
   */
  static userEvent(action: string, data?: string): WebcamEvent {
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
  private _events = new Subject<WebcamEvent>();
  private _events$ = this._events.asObservable();

  /**
   * Возвращает список событий
   */
  public get events(): Observable<WebcamEvent> {
    return this._events$;
  }

  /**
   * Вызывает событие закрытия окна
   * @param data - данные для передачи
   */
  close(data?: string): void {
    this._events.next(WebcamEventFactory.closeEvent(data));
    this._events.complete();
  }
  /**
   * Вызывает событие закрытия окна и сохранения данных
   * @param data - данные для передачи
   */
  closeAndSave(data?: string): void {
    this._events.next(WebcamEventFactory.closeAndSaveEvent(data));
    this._events.complete();
  }

  /**
   * Emit modal event
   * @param event - modal event
   * @param complete - complete event? (close window)
   */
  public push(event: WebcamEvent, complete?: boolean): void {
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
  private _data: string = null;

  constructor(action: string, data?: string) {
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
  public get data(): string {
    return this._data;
  }

  /**
   * Устанавливает данные события
   * @param data - данные
   */
  public set data(data: string) {
    this._data = data;
  }
}


export const isCloseWebcamEvent = (event: WebcamEvent): boolean =>
  event.action === WebcamEventAction.CLOSE;
export const isCloseAndSaveWebcamEvent = (event: WebcamEvent): boolean =>
  event.action === WebcamEventAction.CLOSE_AND_SAVE;
