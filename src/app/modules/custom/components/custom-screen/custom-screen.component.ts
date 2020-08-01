import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss']
})
export class CustomScreenComponent implements OnInit {

  @Input() data
  constructor() { }

  ngOnInit(): void {
  }

}
