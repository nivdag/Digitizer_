import { TestBed } from '@angular/core/testing';

import { OrdersListService } from './orders-list.service';

describe('OrdersListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdersListService = TestBed.get(OrdersListService);
    expect(service).toBeTruthy();
  });
});
