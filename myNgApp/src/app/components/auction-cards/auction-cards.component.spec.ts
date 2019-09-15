import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCardsComponent } from './auction-cards.component';

describe('AuctionCardsComponent', () => {
  let component: AuctionCardsComponent;
  let fixture: ComponentFixture<AuctionCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
