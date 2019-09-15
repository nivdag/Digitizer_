import { TestBed } from '@angular/core/testing';

import { QuickOcrService } from './quick-ocr.service';

describe('QuickOcrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuickOcrService = TestBed.get(QuickOcrService);
    expect(service).toBeTruthy();
  });
});
