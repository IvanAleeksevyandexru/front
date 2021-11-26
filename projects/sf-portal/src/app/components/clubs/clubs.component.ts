import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'portal-clubs',
  templateUrl: './clubs.component.html',
})
export class ClubsComponent implements OnInit, OnDestroy {
  constructor() {}

  public ngOnInit(): void {
    document.querySelector('.main-container')?.classList.add('new-sf-player');
  }

  public ngOnDestroy(): void {
    document.querySelector('.main-container')?.classList.remove('new-sf-player');
  }
}
