import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-requirements-list',
  templateUrl: './requirements-list.component.html',
  styleUrls: ['./requirements-list.component.scss']
})
export class RequirementsListComponent implements OnInit {
  @Input() data;

  constructor() { }

  ngOnInit(): void { }
}
