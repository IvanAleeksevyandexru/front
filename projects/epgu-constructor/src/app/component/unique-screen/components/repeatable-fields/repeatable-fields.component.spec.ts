import { RepeatableFieldsComponent } from './repeatable-fields.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, Inject } from '@angular/core';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ScreenTypes } from '../../../../screen/screen.types';

describe('RepeatableFieldsComponent', () => {
  let component: RepeatableFieldsComponent;

  let fixture: ComponentFixture<RepeatableFieldsComponent>;
  let displayMock = {
    id:'s113',
    name:'Укажите все изменения ФИО',
    type: ScreenTypes.UNIQUE,
    header:'Укажите все изменения',
    submitLabel:'Далее',
    components:[
      {
        id:'pd6',
        type:'RepeatableFields',
        label:'Добавить еще  ФИО',
        attrs:{
          repeatAmount:'20',
          components:[
            { id:'pd9',type:'StringInput',label:'Прежняя фамилия',
              attrs:{ fstuc:'all',validation:[
                { type:'RegExp',value:'.+',ref:'',dataType:'',condition:'',errorMsg:'Поле не может быть пустым' },
                { type:'RegExp',value:'^[\\s\\S]{0,100}$',ref:'',condition:'',errorMsg:'Поле должно содержать не более 100 символов' }
                ] },
              value:'',required:true,cycled:false },
            { id:'pd10',type:'StringInput',label:'Прежнее имя',
              attrs:{ fstuc:'all',validation:[
                { type:'RegExp',value:'^[\\s\\S]{0,100}$',ref:'',condition:'',errorMsg:'Поле должно содержать не более 100 символов' }
                ] },
              value:'',required:false,cycled:false },
            { id:'pd11',type:'StringInput',label:'Прежнее отчество',
              attrs:{ fstuc:'all',validation:[
                { type:'RegExp',value:'^[\\s\\S]{0,100}$',ref:'',condition:'',errorMsg:'Поле должно содержать не более 100 символов' }
                ],customUnrecLabel:'При наличии' },
              value:'',required:false,cycled:false }
            ],
          fields:[],
          actions:[]
        },
        arguments:{},
        value:'',
        required:true,
        cycled:false
      }
      ],
    accepted:true,
    impasse:false,
    terminal:false,
    firstScreen:false
  };

  let screenService: ScreenService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ RepeatableFieldsComponent ],
      providers: [
        CurrentAnswersService,
        ChangeDetectorRef,
        { provide: ScreenService, useClass: ScreenServiceStub }
      ]
    })
    .compileComponents();
    screenService = Inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatableFieldsComponent);
    component = fixture.componentInstance;
    spyOn<any>(component, 'getCache').and.returnValue({});
    component.data = displayMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
