import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import ListPaginationService from './list-pagination.service';
import { ForTestsOnlyModule } from '../../../core/for-tests-only.module';

describe('ValidationService', () => {
  let service: ListPaginationService<any>;

  const listElem = [
    {
      originalItem: {
        value: '0a498919-0fcf-45f2-af29-6da3ebab140b',
        title:
          'Муниципальное автономное общеобразовательное учреждение  средняя общеобразовательная школа № 197',
      },
      id: '0a498919-0fcf-45f2-af29-6da3ebab140b',
      text:
        'Муниципальное автономное общеобразовательное учреждение  средняя общеобразовательная школа № 197',
      checked: false,
      label:
        '<b>Муниципальное автономное общеобразовательное учреждение  средняя общеобразовательная школа № 197</b>',
    },
  ];

  function getList(size: number) {
    return new Array(size).fill(listElem);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ForTestsOnlyModule],
      providers: [ListPaginationService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ListPaginationService);
    service.initSize = 3;
    service.pageSize = 5;
  });

  describe('cases', () => {
    it('should work for case01', () => {
      service.setData(getList(5));
      expect(service['isFinished'].value).toEqual(false);
      expect(service['paginatedData'].getValue().length).toEqual(3);
    });

    it('should work for case02', () => {
      service.setData(getList(4));
      expect(service['isFinished'].value).toEqual(false);
      expect(service['paginatedData'].getValue().length).toEqual(3);
    });

    it('should work for case03', () => {
      service.setData(getList(2));
      expect(service['isFinished'].value).toEqual(true);
      expect(service['paginatedData'].getValue().length).toEqual(2);
    });
  });
});
