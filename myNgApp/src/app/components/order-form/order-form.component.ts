import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { OrderService } from '../../services/order.service'
import { Response } from 'selenium-webdriver/http';
import { OrderDataService } from 'src/app/services/order-data.service';
import { OrderItem } from 'src/app/models/OrderItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderModel = new Order('', '', '');
  extensions = ['.docx', '.txt', '.pdf'];
  priorities = ['none', 'fast', 'premium'];
  selectedFile = null;
  isSelected = false;
  fd = new FormData();
  errorMsg = '';

  //cross component data
  crossData = new OrderItem(0,'','','','');

  constructor(private _orderService: OrderService, private data: OrderDataService, private _router: Router) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(_crossData => this.crossData = _crossData)
   }

  onSubmit() {
    this.fd.append('file', this.selectedFile, this.selectedFile.name);
    this.fd.append('extension', this.orderModel.extension);
    this.fd.append('priority', this.orderModel.priority);

    this._orderService.order(this.fd).subscribe( 
      data => {
        console.log('Success', data)

        this.crossData.price = data.price;
        this.crossData.destExtension = data.createdDocument.extension;
        this.crossData.priority = data.createdDocument.priority;
        this.crossData.srcExtension = data.srcExtension;
        this.crossData.filename = data.srcFilename;
        
        this.newData()
      },
      error => this.errorMsg = error.statusText
    )

      this.fd.delete('file');
      this.fd.delete('extension');
      this.fd.delete('priority');

      this.isSelected = false;

      this._router.navigate(['/manage-orders'])
  }

  newData(){
    this.data.changeMessage(this.crossData);
  }

  onSelectFile(event) {
    this.selectedFile = <File>event.target.files[0];
    this.isSelected = true;
  }

}
