import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent implements OnInit {
  @Input() for: string;
  @Input() required: boolean;
  @Input() tips: string;

  ngOnInit(): void {}
}
