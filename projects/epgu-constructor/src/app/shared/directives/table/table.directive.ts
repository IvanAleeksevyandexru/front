import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-table]'
})
export class TableDirective implements AfterViewInit {
  tableClass = '.epgu-constructor-table';
  attrName = 'data-header';
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit (): void {
    const tables = this.elRef.nativeElement.querySelectorAll(this.tableClass) as HTMLTableElement[];
    if (tables.length) {
      tables.forEach(({ rows }: HTMLTableElement) => {
        let headAttrs;
        Array.from(rows).forEach((row: HTMLTableRowElement, index: number) => {
          const cellsArr = Array.from(row.cells);
          if (index < 1) {
            headAttrs = cellsArr.map((cell: HTMLTableDataCellElement) => cell.getAttribute(this.attrName));
          }
          cellsArr.forEach((cell: HTMLTableDataCellElement, i: number) => {
            const headerEl = document.createElement('div');
            headerEl.className = 'header';
            if(!cell.hasAttribute(this.attrName)) {
              headerEl.innerText = headAttrs[i].replace(/(<([^>]+)>)/gi, '');
              cell.firstChild.before(headerEl);
            } else {
              cell.innerHTML = headAttrs[i];
            }
          });
        });
      });
    }
  }
}
