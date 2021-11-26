import { Component } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';
import { NavigationEnd, Router } from '@angular/router';
import { MainPageService } from '@epgu/ui/services/main-page';
import { IMainData } from '@epgu/ui/models/main-data';
import { CatalogTabsService } from '@epgu/ui/services/catalog-tabs';
import { CountersService } from '@epgu/ui/services/counters';

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public loaded = false;

  constructor(
    public router: Router,
    public loadService: LoadService,
    private mainPageService: MainPageService,
    private catalogTabsService: CatalogTabsService,
    private countersService: CountersService,
  ) {}

  private static documentScrollTop(): void {
    window.scrollTo(0, 0);
  }

  public ngOnInit() {
    this.onRouteChange();
    this.getMainBlocksData();
    this.initCounters();
    this.fadeOutEffect(document.getElementById('start-app-loader') as HTMLElement);
  }

  public getMainBlocksData(): void {
    this.mainPageService.getMainBlocksData().subscribe(
      (data: IMainData) => {
        this.mainPageService.mainBlocksData = data;
        this.catalogTabsService.catalogTabsList = data.catalog;
        this.loaded = true;
      },
      (err) => {
        // TODO: пока так, потом можно будет поменять, когда станет понятна природа ошибки
        // eslint-disable-next-line no-console
        console.error(err);
        this.loaded = true;
      },
    );
  }

  private initCounters(): void {
    this.countersService.loadCounters();
  }

  private fadeOutEffect(elem: HTMLElement) {
    const fadeEffect = setInterval(() => {
      if (!elem.style.opacity) {
        elem.style.opacity = '1';
      }
      if (parseFloat(elem.style.opacity) > 0) {
        const magicNumber = 0.2;
        elem.style.opacity = `${parseFloat(elem.style.opacity) - magicNumber}`;
      } else {
        clearInterval(fadeEffect);
        if (elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      }
    }, 50);
  }

  private onRouteChange(): void {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        AppComponent.documentScrollTop();
      }
    });
  }
}
