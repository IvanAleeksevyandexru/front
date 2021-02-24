import { NgModule } from '@angular/core';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteApiService } from './autocomplete-api.service';


@NgModule({
  providers: [
    AutocompleteService,
    AutocompleteApiService,
  ],
})
export class AutocompleteModule {}
