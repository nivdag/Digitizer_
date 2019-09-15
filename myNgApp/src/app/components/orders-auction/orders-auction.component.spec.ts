import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersAuctionComponent } from './orders-auction.component';

describe('OrdersAuctionComponent', () => {
  let component: OrdersAuctionComponent;
  let fixture: ComponentFixture<OrdersAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
