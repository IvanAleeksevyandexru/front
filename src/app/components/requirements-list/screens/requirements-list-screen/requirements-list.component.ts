import { Component, OnInit, Input } from '@angular/core';
import { SimpleComponentInterface } from '../../../../interfaces/simple-component.interface';

@Component({
  selector: 'app-requirements-list',
  templateUrl: './requirements-list.component.html',
  styleUrls: ['./requirements-list.component.scss']
})
export class RequirementsListComponent implements OnInit {
  @Input() data: SimpleComponentInterface;

  constructor() { }

  ngOnInit(): void { }

  nextStep(): void {}
}
