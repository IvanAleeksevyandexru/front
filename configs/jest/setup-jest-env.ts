import 'zone.js/fesm2015/zone-testing-bundle.min.js';
import '@angular-extensions/pretty-html-log';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
//   teardown: {
//     destroyAfterEach: true, // Angular recommends this, but it may break existing tests
//   },
// });
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());