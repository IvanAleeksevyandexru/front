import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightModule } from '@epgu/ui/pipes';
import { DropdownListComponent } from './dropdown-list.component';
import { BaseModule } from '../../../../shared/base.module';
import { FilterPipe } from '../../pipes/filter.pipe';

describe('DropdownListComponent', () => {
  let component: DropdownListComponent;
  let fixture: ComponentFixture<DropdownListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownListComponent, FilterPipe],
      imports: [BaseModule, HighlightModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownListComponent);
    component = fixture.componentInstance;
    component.items = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
