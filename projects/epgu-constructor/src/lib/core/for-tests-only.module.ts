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
  JsonHelperService,
  MapAnimationService,
  DeviceDetectorServiceStub,
  ActivatedRouteStub,
  FocusManagerService,
  SafeModule,
  ConstructorLookupModule,
  ObjectHelperService,
  MicroAppStateStore,
  CfAppStateService,
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
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from './services/terra-byte-api/terra-byte-api.service.stub';
import { UploaderProcessService } from '../shared/components/file-upload/services/process/uploader-process.service';
import { UploaderStoreServiceStub } from '../shared/components/file-upload/services/store/uploader-store.service.stub';
import { UploaderStoreService } from '../shared/components/file-upload/services/store/uploader-store.service';
import { UploaderManagerServiceStub } from '../shared/components/file-upload/services/manager/uploader-manager.service.stub';
import { UploaderManagerService } from '../shared/components/file-upload/services/manager/uploader-manager.service';
import { UploaderStatService } from '../shared/components/file-upload/services/stat/uploader-stat.service';
import { UploaderStatServiceStub } from '../shared/components/file-upload/services/stat/uploader-stat.service.stub';
import { UploaderValidationServiceStub } from '../shared/components/file-upload/services/validation/uploader-validation.service.stub';
import { UploaderValidationService } from '../shared/components/file-upload/services/validation/uploader-validation.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClickableLabelModule } from '../shared/directives/clickable-label/clickable-label.module';
import { ActionService } from '../shared/directives/action/action.service';
import { ActionToolsService } from '../shared/directives/action/action-tools.service';
import { DictionaryService } from '../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../shared/services/dictionary/dictionary.service.stub';
import { StateService } from '../component/unique-screen/components/children-clubs/services/state/state.service';
import { ScreenButtonService } from '../shared/components/screen-buttons/screen-button.service';
import { SuggestHandlerService } from '../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../shared/services/suggest-monitor/suggest-monitor.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { AutocompleteAutofillService } from './services/autocomplete/autocomplete-autofill.service';
import { AutocompletePrepareService } from './services/autocomplete/autocomplete-prepare.service';

/**
 * Здесь храниться всё providers которые необходимы во всех слоях и должны быть синглетоном.
 */
@NgModule({
  imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule],
  providers: [
    { provide: ActivatedRoute, useClass: ActivatedRouteStub },
    { provide: ConfigService, useClass: ConfigServiceStub },
    { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
    { provide: DictionaryService, useClass: DictionaryServiceStub },
    { provide: LocationService, useClass: LocationServiceStub },
    { provide: NavigationService, useClass: NavigationServiceStub },
    { provide: ScreenService, useClass: ScreenServiceStub },
    { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
    { provide: UploaderManagerService, useClass: UploaderManagerServiceStub },
    { provide: UploaderStatService, useClass: UploaderStatServiceStub },
    { provide: UploaderStoreService, useClass: UploaderStoreServiceStub },
    { provide: UploaderValidationService, useClass: UploaderValidationServiceStub },
    { provide: WINDOW, useValue: window },
    ActionService,
    ActionToolsService,
    AddressesToolsService,
    AddressHelperService,
    AutocompleteApiService,
    AutocompleteAutofillService,
    AutocompletePrepareService,
    AutocompleteService,
    CachedAnswersService,
    CfAppStateService,
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
    DictionaryService,
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
    MicroAppStateStore,
    ModalErrorService,
    ModalService,
    NavigationModalService,
    ObjectHelperService,
    PrepareComponentsService,
    PriorityItemsService,
    RefRelationService,
    RelationResolverService,
    ScreenButtonService,
    SelectMapObjectService,
    SessionService,
    SessionStorageService,
    StateService,
    SuggestHandlerService,
    SuggestMonitorService,
    TypeCastService,
    UnsubscribeService,
    UploaderProcessService,
    ValidationService,
    YandexMapService,
  ],
  exports: [SafeModule, ConstructorLookupModule, ClickableLabelModule],
})
export class ForTestsOnlyModule {}
