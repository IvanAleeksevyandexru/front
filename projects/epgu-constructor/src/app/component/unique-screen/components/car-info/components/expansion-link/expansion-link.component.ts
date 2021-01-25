import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-expansion-link',
  templateUrl: './expansion-link.component.html',
  styleUrls: ['./expansion-link.component.scss'],
})
export class ExpansionLinkComponent implements OnInit {
  @Input() isExpanded = false;

  ngOnInit(): void {}
}
