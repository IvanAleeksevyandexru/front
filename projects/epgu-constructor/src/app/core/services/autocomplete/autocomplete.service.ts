import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { SuggestionsApiResponse } from '../../../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class AutocompleteService {

  constructor(private formPlayerApiService: FormPlayerApiService) {
    console.log('AutocompleteService!');
  }

  getSuggestions(fields: Array<string>): Observable<Array<SuggestionsApiResponse>> {
    return this.formPlayerApiService.getSuggestions(fields);
  }
}
