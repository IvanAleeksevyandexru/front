/* eslint-disable max-len */
import { HttpClientModule } from '@angular/common/http';
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
  JsonHelperService,
  MapAnimationService,
  DeviceDetectorServiceStub,
  ActivatedRouteStub,
  FocusManagerService,
} from '@epgu/epgu-constructor-ui-kit';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KindergartenService } from '../component/unique-screen/components/kindergarten/kindergarten.service';
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
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { NavigationService } from './services/navigation/navigation.service';
import { NavigationServiceStub } from './services/navigation/navigation.service.stub';
import { HtmlSelectService } from './services/html-select/html-select.service';
import { JusticeSearchPanelService } from '../component/unique-screen/components/select-map-object/components/search-panel-resolver/components/justice-search-panel/justice-search-panel.service';
import { DateRangeService } from '../shared/services/date-range/date-range.service';
import { ComponentsListFormService } from '../component/custom-screen/services/components-list-form/components-list-form.service';
import { FormBuilder } from '@angular/forms';
import { ValidationService } from '../shared/services/validation/validation.service';
import { DateRestrictionsService } from '../shared/services/date-restrictions/date-restrictions.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentsListToolsService } from '../component/custom-screen/services/components-list-tools/components-list-tools.service';
import { TypeCastService } from './services/type-cast/type-cast.service';
import { ComponentsListRelationsService } from '../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { RelationResolverService } from '../component/custom-screen/services/components-list-relations/relation-resolver.service';
import { MaskTransformService } from '../shared/services/mask-transform/mask-transform.service';
import { DecimalPipe } from '@angular/common';

/**
 * Здесь храниться всё providers которые необходимы во всех слоях и должны быть синглетоном.
 */
@NgModule({
  imports: [HttpClientModule, BrowserAnimationsModule],
  providers: [
    { provide: ActivatedRoute, useClass: ActivatedRouteStub },
    { provide: ConfigService, useClass: ConfigServiceStub },
    { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
    { provide: LocationService, useClass: LocationServiceStub },
    { provide: NavigationService, useClass: NavigationServiceStub },
    { provide: ScreenService, useClass: ScreenServiceStub },
    { provide: WINDOW, useValue: window },
    AddressesToolsService,
    AddressHelperService,
    AutocompleteApiService,
    CachedAnswersService,
    ComponentsListFormService,
    ComponentsListRelationsService,
    ComponentsListToolsService,
    CurrentAnswersService,
    DateRangeService,
    DateRefService,
    DateRestrictionsService,
    DatesToolsService,
    DecimalPipe,
    DictionaryApiService,
    DictionaryToolsService,
    DownloadService,
    EventBusService,
    FocusManagerService,
    FormBuilder,
    FormPlayerApiService,
    FormPlayerService,
    HtmlRemoverService,
    HtmlSelectService,
    Icons,
    InitDataService,
    JsonHelperService,
    JusticeSearchPanelService,
    KindergartenSearchPanelService,
    KindergartenService,
    LocalStorageService,
    LoggerService,
    MapAnimationService,
    MaskTransformService,
    ModalErrorService,
    ModalService,
    NavigationModalService,
    PrepareComponentsService,
    PriorityItemsService,
    RefRelationService,
    RelationResolverService,
    SelectMapObjectService,
    SessionService,
    SessionStorageService,
    TypeCastService,
    UnsubscribeService,
    ValidationService,
    YandexMapService,
  ],
})
export class ForTestsOnlyModule {}
