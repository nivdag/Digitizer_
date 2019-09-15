import { Component, OnInit } from '@angular/core';
import { OrderDataService } from 'src/app/services/order-data.service';
import { OrderItem } from 'src/app/models/OrderItem';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  //cross component data
  crossData = new OrderItem(0,'','','','');

  constructor(private data: OrderDataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(_crossData => this.crossData = _crossData)
  }

}
