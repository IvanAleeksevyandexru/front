import { Component, OnInit, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { MainPageService } from '@epgu/ui/services/main-page';
import { IMainData } from '@epgu/ui/models/main-data';
import { CatalogTabsService } from '@epgu/ui/services/catalog-tabs';
import { CountersService } from '@epgu/ui/services/counters';
import { YaMetricService } from '@epgu/ui/services/ya-metric';
import { PsoService } from '@epgu/ui/services/pso';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { HeaderService } from '@epgu/ui/services/header';
import { FooterService } from '@epgu/ui/services/footer';
import { DeviceDetectorService, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { MetaTagGeneratorService } from './services/meta-tag-generator/meta-tag-generator.service';

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public loaded = false;
  public isServer = isPlatformServer(this.platformId);

  constructor(
    public router: Router,
    public loadService: LoadService,
    private deviceDetectorService: DeviceDetectorService,
    private headerService: HeaderService,
    private footerService: FooterService,
    private mainPageService: MainPageService,
    private catalogTabsService: CatalogTabsService,
    private countersService: CountersService,
    private yaMetricService: YaMetricService,
    private psoService: PsoService,
    private metaTagGeneratorService: MetaTagGeneratorService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.yaMetricService.init();
  }

  public ngOnInit() {
    if (this.isServer) {
      this.router.events.subscribe((route) => {
        if (route instanceof RoutesRecognized) {
          const context = route.url.split('?')[0].substring(1); // чтобы получить path вида '600109/1/form'
          if (context) {
            this.fetchAndAddMetaByContext(context);
          }
        }
      });

      return;
    }

    this.onRouteChange();
    this.getMainBlocksData();
    this.initCounters();
    this.fadeOutEffect(this.document.getElementById('start-app-loader') as HTMLElement);
    this.setWebViewUi();
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

  private async fetchAndAddMetaByContext(context: string): Promise<void> {
    const data = await this.metaTagGeneratorService.loadData();
    const openGraphInfo = this.metaTagGeneratorService.getItemByContext(data, context);
    this.metaTagGeneratorService.addInfoToMeta(openGraphInfo);
  }

  private initCounters(): void {
    this.countersService.loadCounters();
  }

  private fadeOutEffect(elem: HTMLElement) {
    const fadeEffect = setInterval(() => {
      if (!elem.style.opacity) {
        // eslint-disable-next-line no-param-reassign
        elem.style.opacity = '1';
      }
      if (parseFloat(elem.style.opacity) > 0) {
        const magicNumber = 0.2;
        // eslint-disable-next-line no-param-reassign
        elem.style.opacity = `${parseFloat(elem.style.opacity) - magicNumber}`;
      } else {
        clearInterval(fadeEffect);
        if (elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      }
    }, 50);
  }

  private documentScrollTop(): void {
    if ('scrollTo' in this.window) {
      this.window.scrollTo(0, 0);
    }
  }

  private onRouteChange(): void {
    const prevPath = this.document.referrer || window.location.href;
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.documentScrollTop();
        this.initMetric(prevPath);
      }
    });
  }

  private setWindowParams() {
    if (this.psoService.isPsoRequired()) {
      window.psoOnlyRobomaxIcon = this.loadService.config.psoOnlyRobomaxIcon;
      window.showNewDesignPsoHelp = this.loadService.config.showNewDesignPsoHelp;
      window.betaUrl = this.loadService.config.betaUrl;
      this.psoService.loadAndRunPso();
    }
  }

  private setWebViewUi() {
    if (this.deviceDetectorService.isWebView) {
      this.headerService.setVisible(false);
      this.footerService.setVisible(false);
    } else {
      this.setWindowParams();
    }
  }

  private initMetric(prevPath: string) {
    if (!isDevMode()) {
      this.yaMetricService.onInit().then(() => {
        const newPath = window.location.href;
        this.yaMetricService.ym(this.yaMetricService.counter, 'hit', newPath, {
          referer: prevPath,
        });
        prevPath = newPath;
      });
    }
  }
}
