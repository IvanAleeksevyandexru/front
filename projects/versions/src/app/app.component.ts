import { Component, OnInit } from '@angular/core';
import { GetVersionsService } from './services/get-versions.service';
import { VersionSet } from './shared/interfaces';
import { ErrorService } from './services/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  versions: VersionSet[];
  constructor(private versionsService: GetVersionsService, public errorService: ErrorService) {}

  ngOnInit() {
    this.versions = [
      {
        standType: 'Uat',
        libVersions$: this.versionsService.getLibVersionsFromUat(),
        serviceVersions$: this.versionsService.getServiceVersionsFromUat(),
      },
      {
        standType: 'Uat2',
        libVersions$: this.versionsService.getLibVersionsFromUat2(),
      },
      {
        standType: 'Dev-l11',
        libVersions$: this.versionsService.getLibVersionsFromDevL11(),
        serviceVersions$: this.versionsService.getServiceVersionsFromDevL11(),
      },
      {
        standType: 'Dev01',
        libVersions$: this.versionsService.getLibVersionsFromDev01(),
        serviceVersions$: this.versionsService.getServiceVersionsFromDev01(),
      },
      {
        standType: 'Dev02',
        libVersions$: this.versionsService.getLibVersionsFromDev02(),
        serviceVersions$: this.versionsService.getServiceVersionsFromDev02(),
      },
      {
        standType: 'PROD',
        libVersions$: this.versionsService.getLibVersionsFromProd(),
      },
      {
        standType: 'PRODLike',
        libVersions$: this.versionsService.getLibVersionsFromProdLike(),
        serviceVersions$: this.versionsService.getServiceVersionsFromProdLike(),
      },
    ];
  }
}
