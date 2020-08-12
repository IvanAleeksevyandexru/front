import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
})
export class InfoScreenBodyComponent implements OnInit {
  @Input() data;

  ngOnInit(): void {}
}
