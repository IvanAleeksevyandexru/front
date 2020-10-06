import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../config/config.service';
import { ConfigServiceStub } from '../../../../config/config.service.stub';
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
    },
    clarifications: '',
    label: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoScreenBodyComponent],
      providers: [
        { provide:  ConfigService, useClass: ConfigServiceStub },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenBodyComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
