import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-screen-container',
  templateUrl: './screen-container.component.html',
  styleUrls: ['./screen-container.component.scss'],
})
export class ScreenContainerComponent implements OnInit {
  @Input('show-nav') showNav = true;
  ngOnInit(): void {}
}
