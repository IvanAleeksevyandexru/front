import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-screen-body',
  templateUrl: './requirements-list.component.html',
  styleUrls: ['./requirements-list.component.scss'],
})
export class InfoScreenBodyComponent implements OnInit {
  @Input() data;

  ngOnInit(): void {}
}
