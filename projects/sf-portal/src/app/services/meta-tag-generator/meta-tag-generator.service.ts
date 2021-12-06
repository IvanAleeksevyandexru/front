import { Injectable } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { KeyValueMap } from '@epgu/epgu-constructor-types';

@Injectable({
  providedIn: 'root'
})
export class MetaTagGeneratorService {
  private openGraphApiUrl = this.loadService.config.openGraphApiUrl;

  constructor(
    private loadService: LoadService,
    private httpClient: HttpClient,
    private metaService: Meta,
  ) { }

  public loadData(): Promise<Object> {
    if (this.openGraphApiUrl) {
      return this.httpClient.get(this.openGraphApiUrl).toPromise();
    }
  }

  public getItemByContext(data: Object, context: string): KeyValueMap[] {
    return data?.[context]?.content;
  }

  public addInfoToMeta(info: KeyValueMap[]): void {
    if (!info) return;

    const tags: MetaDefinition[] = info.map(item => {
      for (const [key, value] of Object.entries(item)) {
        this.metaService.removeTag(`property='${key}'`);
        return { property: key, content: value } as MetaDefinition;
      }
    });

    this.metaService.addTags(tags, true);
  }
}
