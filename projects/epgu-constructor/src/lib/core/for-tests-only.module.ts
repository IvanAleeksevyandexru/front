/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import {
  AddressesToolsService,
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DeviceDetectorService,
  DownloadService,
  EventBusService,
  Icons,
  LocalStorageService,
  LocationService,
  LocationServiceStub,
  LoggerService,
  ModalService,
  SessionService,
  SessionStorageService,
  UnsubscribeService,
  WINDOW,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';
import { KindergartenSearchPanelService } from '../component/unique-screen/components/select-map-object/components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { SelectMapObjectService } from '../component/unique-screen/components/select-map-object/select-map-object.service';
import { PriorityItemsService } from '../component/unique-screen/components/select-map-object/services/priority-items/priority-items.service';
import { FormPlayerApiService } from '../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../form-player/services/form-player/form-player.service';
import { ModalErrorService } from '../modal/modal-error.service';
import { CurrentAnswersService } from '../screen/current-answers.service';
import { ScreenService } from '../screen/screen.service';
import { ScreenServiceStub } from '../screen/screen.service.stub';
import { AddressHelperService } from '../shared/services/address-helper/address-helper.service';
import { CachedAnswersService } from '../shared/services/cached-answers/cached-answers.service';
import { DictionaryApiService } from '../shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../shared/services/dictionary/dictionary-tools.service';
import { HtmlRemoverService } from '../shared/services/html-remover/html-remover.service';
import { PrepareComponentsService } from '../shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '../shared/services/ref-relation/ref-relation.service';
import { AutocompleteApiService } from './services/autocomplete/autocomplete-api.service';
import { DateRefService } from './services/date-ref/date-ref.service';
import { InitDataService } from './services/init-data/init-data.service';
import { JsonHelperService } from './services/json-helper/json-helper.service';
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { NavigationService } from './services/navigation/navigation.service';
import { NavigationServiceStub } from './services/navigation/navigation.service.stub';

/**
 * Здесь храниться всё providers которые необходимы во всех слоях и должны быть синглетоном.
 */
@NgModule({
  providers: [
    { provide: ConfigService, useClass: ConfigServiceStub },
    { provide: LocationService, useClass: LocationServiceStub },
    { provide: NavigationService, useClass: NavigationServiceStub },
    { provide: ScreenService, useClass: ScreenServiceStub },
    { provide: WINDOW, useValue: window },
    AddressesToolsService,
    AddressHelperService,
    AutocompleteApiService,
    CachedAnswersService,
    CurrentAnswersService,
    DateRefService,
    DatesToolsService,
    DeviceDetectorService,
    DictionaryApiService,
    DictionaryToolsService,
    DownloadService,
    EventBusService,
    FormPlayerApiService,
    FormPlayerService,
    HtmlRemoverService,
    Icons,
    InitDataService,
    JsonHelperService,
    KindergartenSearchPanelService,
    LocalStorageService,
    LoggerService,
    ModalErrorService,
    ModalService,
    NavigationModalService,
    PrepareComponentsService,
    PriorityItemsService,
    RefRelationService,
    SelectMapObjectService,
    SessionService,
    SessionStorageService,
    UnsubscribeService,
    YandexMapService,
  ]
})
export class ForTestsOnlyModule {}
