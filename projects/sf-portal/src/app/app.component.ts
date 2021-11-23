import { Component } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';
import { NavigationEnd, Router } from '@angular/router';
import { MainPageService } from '@epgu/ui/services/main-page';
import { IMainData } from '@epgu/ui/models/main-data';
import { CatalogTabsService } from '@epgu/ui/services/catalog-tabs';
import { CountersService } from '@epgu/ui/services/counters';
import { CounterData, CounterTarget } from '@epgu/ui/models/counter';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public loaded: boolean = false;
  public userCounter: CounterData;
  private counterSub: Subscription;


  constructor(
    public loadService: LoadService,
    private mainPageService: MainPageService,
    private catalogTabsService: CatalogTabsService,
    private countersService: CountersService,
    public router: Router,
  ) {

  }

  private static documentScrollTop(): void {
    window.scrollTo(0, 0);
  }

  public ngOnInit() {
    this.onRouteChange();
    this.getMainBlocksData();
    this.initCounters();
    this.fadeOutEffect(document.getElementById('start-app-loader') as HTMLElement);
  }

  private initCounters(): void {
    this.countersService.loadCounters();
    this.counterSub = this.countersService.counters$.subscribe(_ => {
      this.userCounter = this.countersService.getCounter(CounterTarget.USER);
    });
  }


  private fadeOutEffect(elem: HTMLElement) {
    const fadeEffect = setInterval(() => {
      if (!elem.style.opacity) {
        elem.style.opacity = '1';
      }
      if (parseFloat(elem.style.opacity) > 0) {
        elem.style.opacity = (parseFloat(elem.style.opacity) - 0.2) + '';
      } else {
        clearInterval(fadeEffect);
        if (elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      }
    }, 50);
  }

  public getMainBlocksData(): void {
    this.mainPageService.getMainBlocksData().subscribe((data: IMainData) => {
      this.mainPageService.mainBlocksData = data;
      this.catalogTabsService.catalogTabsList = data.catalog;
      this.loaded = true;
    }, () => {
      // TODO: покзать ошибку
      this.loaded = true;
    });
  }

  private onRouteChange(): void {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        AppComponent.documentScrollTop();
      }
    });
  }
}
