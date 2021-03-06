import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { TableDirective } from './table.directive';

@Component({
  template: '<div epgu-constructor-table [innerHTML]="html | safe: \'html\'"></div>',
})
class TableMockComponent {
  html;
}

describe('TableDirective', () => {
  let fixture: ComponentFixture<TableMockComponent>;
  let component: TableMockComponent;
  let outerHtmlEl: HTMLElement;

  const createNewViewChild = () => {
    fixture = TestBed.createComponent(TableMockComponent);
    component = fixture.componentInstance;
    outerHtmlEl = fixture.debugElement.nativeElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableDirective, TableMockComponent, SafePipe],
    })
      .overrideComponent(TableMockComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  describe('created without .epgu-constructor-table', () => {
    beforeEach(() => {
      createNewViewChild();
      component.html = '<table><tr><th data-header="test"></th></tr></table>';
      fixture.detectChanges();
    });

    it('should`n modify', () => {
      expect(outerHtmlEl.querySelectorAll('.header').length).toBe(0);
      expect(outerHtmlEl.querySelectorAll('.media-table').length).toBeFalsy();
    });
  });

  describe('created without data-header', () => {
    beforeEach(() => {
      createNewViewChild();
      component.html = '<table class="epgu-constructor-table"><tr><th></th></tr></table>';
      fixture.detectChanges();
    });

    it('should`n modify', () => {
      expect(outerHtmlEl.querySelectorAll('.header').length).toBe(0);
      expect(outerHtmlEl.querySelectorAll('.media-table').length).toBeFalsy();
    });
  });

  describe('should modify', () => {
    beforeEach(() => {
      createNewViewChild();
      component.html = `
          <table class="epgu-constructor-table">
              <tr>
                <td data-header="media"></td>
              </tr>
              <tr>
                <td>...</td>
              </tr>
          </table>
      `;
      fixture.detectChanges();
    });

    it('and set .media-table', () => {
      expect(outerHtmlEl.querySelectorAll('.header').length).toBe(1);
      expect(outerHtmlEl.querySelectorAll('.media-table').length).toBeTruthy();
    });
  });

  describe('create with more then one table', () => {
    beforeEach(() => {
      createNewViewChild();
      component.html = `
          <table class="epgu-constructor-table"></table>
          <table class="epgu-constructor-table table-bordered"></table>
    `;
      fixture.detectChanges();
    });

    it('should have 2 tables elements', () => {
      const tableEl = outerHtmlEl.querySelectorAll('.epgu-constructor-table');
      expect(tableEl.length).toBe(2);
    });
  });

  describe('should have header', () => {
    beforeEach(() => {
      createNewViewChild();
      component.html = `
          <table class="epgu-constructor-table">
            <tbody>
              <tr>
                <td data-header="<div>??????????<br> ??????????????</div>"></td>
              </tr>
              <tr>
                <td>?????????? 12</td>
              </tr>
            </tbody>
          </table>
      `;
      fixture.detectChanges();
    });

    it('in thead with html', () => {
      const rows = Array.from<HTMLTableCellElement>(outerHtmlEl.querySelector('tr').cells);
      expect(rows[0].innerHTML).toBe('<div>??????????<br> ??????????????</div>');
    });

    it('in td without html', () => {
      const headers = outerHtmlEl.querySelectorAll('.header');
      expect(headers[0].innerHTML).toBe('?????????? ??????????????');
    });
  });
});
