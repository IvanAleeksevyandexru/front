import { Injectable, OnDestroy } from '@angular/core';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryResponse } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';

@Injectable()
export class KindergartenSearchPanelService implements OnDestroy {
  public EDUORGMAX: number;

  public deptsChoosen$ = new BehaviorSubject<number>(0);

  get childHomeCoords(): number[] {
    return this.getChildHomeCoordinates();
  }

  constructor(
    private screenService: ScreenService,
    private dictionaryApiService: DictionaryApiService,
  ) {
    this.getEDUORGMAX();
  }

  // TODO не вызывается из-за того что лежит в провайдерах модуля. Перенести в компонент
  ngOnDestroy(): void {
    this.deptsChoosen$.complete();
  }

  public getEDUORGMAX(): Observable<DictionaryResponse> {
    const municipalOktmo = this.screenService.component?.arguments?.municipalOktmo as string;
    if (!municipalOktmo) {
      return;
    }
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

    return this.dictionaryApiService.getGenericDictionary('KINDERGARTEN_EDUORGMAX', requestBody);
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
