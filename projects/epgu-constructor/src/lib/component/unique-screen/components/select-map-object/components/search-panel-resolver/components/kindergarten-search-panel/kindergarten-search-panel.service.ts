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

  constructor(
    private screenService: ScreenService,
    private dictionaryApiService: DictionaryApiService,
  ) {
    this.getEDUORGMAX();
    this.deptsLeftToChoose$.subscribe((value) => {
      this.bottomLabel$.next(`Выбрано ${this.EDUORGMAX - value} из ${this.EDUORGMAX}. Посмотреть`);
    });
  }

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
}
