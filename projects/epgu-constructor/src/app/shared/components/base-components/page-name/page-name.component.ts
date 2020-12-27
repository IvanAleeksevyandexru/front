import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-page-name',
  templateUrl: './page-name.component.html',
  styleUrls: ['./page-name.component.scss'],
})
export class PageNameComponent implements OnInit {
  constructor(public screenService: ScreenService) {}
  ngOnInit(): void {}
}
