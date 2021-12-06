import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { MetaTagGeneratorService } from './meta-tag-generator.service';

describe('MetaTagGeneratorService', () => {
  let service: MetaTagGeneratorService;
  let httpClient: HttpClient;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient, Meta]
    });
    service = TestBed.inject(MetaTagGeneratorService);
    httpClient = TestBed.inject(HttpClient);
    metaService = TestBed.inject(Meta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadData()', () => {
    it('should call httpClient.get if openGraphApiUrl exists', () => {
      const spy = jest.spyOn(httpClient, 'get').mockReturnValue(of({}));
      service['openGraphApiUrl'] = 'url';
      service.loadData();
      expect(spy).toHaveBeenCalledWith(service['openGraphApiUrl']);
    });
  });

  describe('addInfoToMeta()', () => {
    it('should call metaService.removeTag with property=${key} while processing info', () => {
      const spy = jest.spyOn(metaService, 'removeTag');
      const info = [{ key2: 'Foo bar' }];
      const result = 'property=\'key2\'';
      service.addInfoToMeta(info);
      expect(spy).toHaveBeenCalledWith(result);
    });

    it('should call metaService.addTags with info formatted to tags', () => {
      const spy = jest.spyOn(metaService, 'addTags');
      const info = [{ key2: 'Foo bar' }, { key1: 'BarFoo' }];
      const result = [
        { content: 'Foo bar', property: 'key2' },
        { content: 'BarFoo', property: 'key1' }
      ];
      service.addInfoToMeta(info);
      expect(spy).toHaveBeenCalledWith(result, true);
    });
  });
});
