import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-table]'
})
export class TableDirective implements AfterViewInit {
  tableClass = '.epgu-constructor-table';
  attrName = 'data-header';

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
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
              const headerEl = this.renderer.createElement('div');
              this.renderer.addClass(headerEl, 'header');

              if (cell.hasAttribute(this.attrName)) {
                this.renderer.setProperty(cell, 'innerHTML', headAttrs[i]);
              } else {
                const text = (headAttrs[i] || '').replace(/(<([^>]+)>)/gi, '');
                const headerText = this.renderer.createText(text);
                this.renderer.appendChild(headerEl, headerText);
                this.renderer.insertBefore(cell.firstChild.parentNode, headerEl, cell.firstChild);
              }
            });
        });
      });
    }
  }
}
