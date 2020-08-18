import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './epguc-label.component.html',
  styleUrls: ['./epguc-label.component.scss'],
})
export class EpgucLabelComponent implements OnInit {
  @Input() for: string;
  @Input() required: boolean;
  @Input() tips: string;

  ngOnInit(): void {}
}
