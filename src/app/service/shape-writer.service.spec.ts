import { TestBed } from '@angular/core/testing';

import { ShapeWriterService } from './shape-writer.service';

describe('ShapeWriterService', () => {
  let service: ShapeWriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeWriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
