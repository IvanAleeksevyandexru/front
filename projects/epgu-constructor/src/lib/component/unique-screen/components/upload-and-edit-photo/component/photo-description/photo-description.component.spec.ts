import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';

import { SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { PhotoDescriptionComponent } from './photo-description.component';
import { ClickableLabelDirective } from '../../../../../../shared/directives/clickable-label/clickable-label.directive';

describe('PhotoDescriptionComponent', () => {
  let component: PhotoDescriptionComponent;
  let fixture: ComponentFixture<PhotoDescriptionComponent>;
  let mockData: ComponentDto = {
    id: 'pd5',
    type: 'PhotoUploadComponent',
    label:
      '<p><a id="howtotakephoto">Требования к фото</a></p><p><a id="requirements">Как сделать фото самостоятельно</a></p>',
    attrs: {
      uploadedFile: {
        uploadId: 'passport_photo',
        mnemonic: 'pd5.PhotoUploadComponent.passport_photo.0',
        objectType: 2,
        name: 'fieldList.jpg',
        fileType: ['JPEG', 'JPG', 'PNG', 'BMP'],
        maxSize: 5242880,
        objectId: '',
      },
      clarifications: {
        howtotakephoto: {
          title: 'Как сделать фото?',
          text:
            '<ol style="padding-left: 20px"><br><li style="color: #0d4cd3"> <a id="requirements">примеры удачных фотографий</a></li></ol>',
        },
        whyneedphoto: {
          title: 'Зачем нужно прикладывать фото',
          text:
            '<p>Фото необходимо для формирования электронного дела в МВД России</p>' +
            '<p class=""mt-24">Требования к электронной фотографии такие же как для бумажной</p>' +
            '<p class="mt-24"><a id="requirements">Требования к фото</a></p>',
        },
        requirements: {
          type: 'UniqueModal',
          id: 'PhotoRequirements',
          setting: {
            warning:
              'Убедитесь, что ваша фотография соответствует требованиям ведомства. Это важно, чтобы заявление приняли.',
            body: [
              {
                title: '<b>Фотография ребёнка</b>',
                text:
                  'К фото ребёнка те же требования, что и к фото взрослого. Ребёнок в кадре должен быть один, без посторонних предметов.',
                type: 'child',
                examplePhotos: [
                  { valid: true, description: 'Смотрит прямо', type: 'eyes-forward' },
                ],
              },
            ],
            footer: '<a id="howtotakephoto">Как сделать фото самостоятельно</a>',
          },
        },
      },
    },
    linkedValues: [],
    arguments: {},
    value: '',
    required: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoDescriptionComponent, MockDirective(ClickableLabelDirective), SafePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDescriptionComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
