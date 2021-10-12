import { AfterViewInit, Directive, ElementRef, NgZone, Renderer2 } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-table]',
})
export class TableDirective implements AfterViewInit {
  tableClass = '.epgu-constructor-table';
  attrName = 'data-header';

  constructor(private elRef: ElementRef, private renderer: Renderer2, private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const tables = this.elRef.nativeElement.querySelectorAll(
        this.tableClass,
      ) as HTMLTableElement[];

      if (tables.length) {
        tables.forEach((table: HTMLTableElement) => {
          this.modifyTable(table);
        });
      }
    });
  }

  private modifyTable(table: HTMLTableElement): void {
    const rows = Array.from(table.rows);
    let dataAttrs = [];
    let isMediaTable = false;

    rows.forEach((row: HTMLTableRowElement, index: number) => {
      const cells = Array.from(row.cells);

      if (index === 0) {
        dataAttrs = cells.map((cell: HTMLTableDataCellElement) => cell.getAttribute(this.attrName));
        isMediaTable = dataAttrs.length && dataAttrs.some((attr) => Boolean(attr));
      }

      if (isMediaTable) {
        this.renderer.addClass(table, 'media-table');
        this.modifyCells(cells, dataAttrs);
      }
    });
  }

  private modifyCells(cells: HTMLTableDataCellElement[], dataAttrs: string[]): void {
    cells.forEach((cell: HTMLTableDataCellElement, i: number) => {
      const headerEl = this.renderer.createElement('div');
      this.renderer.addClass(headerEl, 'header');

      if (cell.hasAttribute(this.attrName)) {
        this.renderer.setProperty(cell, 'innerHTML', dataAttrs[i]);
      } else {
        const text = (dataAttrs[i] || '').replace(/(<([^>]+)>)/gi, '');
        const headerText = this.renderer.createText(text);
        this.renderer.appendChild(headerEl, headerText);
        this.renderer.insertBefore(cell.firstChild.parentNode, headerEl, cell.firstChild);
      }
    });
  }
}
