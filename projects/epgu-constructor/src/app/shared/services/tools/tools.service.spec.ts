import { TestBed } from '@angular/core/testing';
import { ToolsService } from './tools.service';


describe('ToolsService', () => {
  let service: ToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ToolsService ]
    });
    service = TestBed.inject(ToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
