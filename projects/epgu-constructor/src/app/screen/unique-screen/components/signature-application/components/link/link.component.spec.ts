import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponent } from './link.component';
import { ApplicationLinkInterface } from '../../models/application.interface';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;
  const applicationLinkMock: ApplicationLinkInterface = {
    pdf: '',
    xml: '',
  };
  const isVisibilityMock = false;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    component.links = applicationLinkMock;
    component.isVisibility = isVisibilityMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
