import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScreenBodyComponent } from './info-screen-body.component';

describe('RequirementsListComponent', () => {
  let component: InfoScreenBodyComponent;
  let fixture: ComponentFixture<InfoScreenBodyComponent>;
  const mockData = {
    attrs: {
      image: {
        src: 'some src',
        alt: 'some alt'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoScreenBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenBodyComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
