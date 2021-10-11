import { Injectable, OnDestroy } from '@angular/core';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryResponse } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';

@Injectable()
export class KindergartenSearchPanelService implements OnDestroy {
  public EDUORGMAX: number;
  public topLabel$ = new BehaviorSubject('');
  public bottomLabel$ = new BehaviorSubject('');
  public deptsLeftToChoose$ = new BehaviorSubject(0);
  private _deptsChoosen$ = new BehaviorSubject<number>(0);

  get childHomeCoords(): number[] {
    return this.getChildHomeCoordinates();
  }

  get deptsChoosen$(): Observable<number> {
    return this._deptsChoosen$.asObservable();
  }

  constructor(
    private screenService: ScreenService,
    private dictionaryApiService: DictionaryApiService,
  ) {
    this.getEDUORGMAX();
    this.deptsLeftToChoose$.subscribe((value) => {
      const choosenCount = this.EDUORGMAX - value;
      this.bottomLabel$.next(`Выбрано ${choosenCount} из ${this.EDUORGMAX}. Посмотреть`);
      this._deptsChoosen$.next(choosenCount);
    });
  }

  // TODO не вызывается из-за того что лежит в провайдерах модуля. Перенести в компонент
  ngOnDestroy(): void {
    this.deptsLeftToChoose$.complete();
    this.topLabel$.complete();
    this.bottomLabel$.complete();
  }

  public getEDUORGMAX(): Observable<DictionaryResponse> {
    const municipalOktmo = this.screenService.component.arguments.municipalOktmo as string;
    const requestBody = {
      filter: {
        simple: {
          attributeName: 'value',
          condition: DictionaryConditions.EQUALS,
          value: {
            asString: municipalOktmo,
          },
        },
      },
      selectAttributes: ['EDUORGMAX'],
    };

    return this.dictionaryApiService.getDictionary('KINDERGARTEN_EDUORGMAX', requestBody);
  }

  private getChildHomeCoordinates(): number[] {
    const {
      childsHome: childsHomeString,
    } = this.screenService.getStore().display.components[0].arguments;
    const childsHomeValue = JSON.parse((childsHomeString as string) || '{}');
    const { geoLon, geoLat } = childsHomeValue;
    return [Number(geoLon), Number(geoLat)];
  }
}
