import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { OrderItem } from '../models/OrderItem';

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {

  private messageSource = new BehaviorSubject<OrderItem>({
    price: 0,
    srcExtension: '',
    destExtension: '',
    priority: '',
    filename: ''
  });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(crossData: OrderItem) {
    this.messageSource.next(crossData)
  }
}
