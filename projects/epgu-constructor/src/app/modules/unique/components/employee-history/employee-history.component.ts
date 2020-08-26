import { Component, Input, OnInit } from '@angular/core';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'epgu-constructor-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss']
})
export class EmployeeHistoryComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Input() header: string;

  constructor() { }

  ngOnInit(): void {
  }

}
