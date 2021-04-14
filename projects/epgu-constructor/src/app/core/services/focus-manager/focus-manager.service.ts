import { Injectable } from '@angular/core';
import { FocusManager, FocusState } from 'epgu-lib';
import { Observable } from 'rxjs/internal/Observable';
import { filter } from 'rxjs/operators';

@Injectable()
export class FocusManagerService {
  state$ = new Observable<FocusState>((subscriber) => {
    const subscription = this.manager.subscribe({
      next: (state) => {
        subscriber.next(state);
      },
      error: (err) => {
        subscriber.error(err);
      },
      complete: () => {
        subscriber.complete();
      },
    });
    return (): void => subscription.unsubscribe();
  });

  constructor(private manager: FocusManager) {}

  stateComponent$(componentId: string): Observable<FocusState> {
    return this.state$.pipe(
      filter((state) => state.prev?.name === componentId || state.current?.name === componentId),
    );
  }
}
