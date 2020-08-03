import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-label-section',
  templateUrl: './label-section.component.html',
  styleUrls: ['./label-section.component.scss']
})
export class LabelSectionComponent implements OnInit {

  @Input() name: string
  constructor() { }

  ngOnInit(): void {
  }

}
