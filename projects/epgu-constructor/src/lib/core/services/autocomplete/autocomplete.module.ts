import { NgModule } from '@angular/core';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteApiService } from './autocomplete-api.service';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';
import { AutocompletePrepareService } from './autocomplete-prepare.service';

@NgModule({
  providers: [
    AutocompleteService,
    AutocompleteApiService,
    AutocompleteAutofillService,
    AutocompletePrepareService,
  ],
})
export class AutocompleteModule {}
