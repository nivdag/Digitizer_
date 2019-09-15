import { Component, OnInit } from '@angular/core';
import { OrdersListService } from '../../services/orders-list.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Order } from 'src/app/models/Order';
import { FileDownloadService } from '../../services/file-download.service';
import { saveAs } from 'file-saver';
import { OrderService } from 'src/app/services/order.service';
import { Documentdetails } from 'src/app/models/Documentdetails';


@Component({
  selector: 'app-orders-auction',
  templateUrl: './orders-auction.component.html',
  styleUrls: ['./orders-auction.component.css']
})

export class OrdersAuctionComponent implements OnInit {

  interval: any;
  dataArr: Documentdetails[]
  authorizedDocs: any[] = []

  constructor(private _ordersService: OrderService, private _fileDownloadService: FileDownloadService, private _orderListService: OrdersListService, private _router: Router) { }

  ngOnInit() {
    this.checkUpdate();
    this.interval = setInterval(() => {
      this.checkUpdate();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.interval) {
        clearInterval(this.interval);
    }
   }

   updateData() {
    this.authorizedDocs = [];
    this.dataArr.forEach((doc) => {
      if (doc.userAccepted == true) {
        this.authorizedDocs.push(doc)
      } 
    })
  }

  checkUpdate(){
    this._orderListService.getOpenOrders()
    .subscribe(
      res => {
        this.dataArr = res.response.documentsArr
        this.updateData();
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['/login'])
          }
        }
      }
    )
  }

  download(index) {
    //console.log(this.dataArr[index]._id)
    //console.log('url/' + this.dataArr[index]._id)

    this._fileDownloadService.downloadFile(this.dataArr[index]._id)
      .subscribe(
        data => saveAs(data, 'savedFile'),
        error => console.log(error)
      );
  }

  downloadOcrFile(index) {
    this._fileDownloadService.downloadOcr(this.dataArr[index]._id)
      .subscribe(
        data => saveAs(data, 'ocrFile'),
        error => console.log(error)
      );
  }

  takeOrder(index) {
    var body = {
      'empId': true
    }
    console.log(this.dataArr[index])
    this._ordersService.updateEmp(this.dataArr[index]._id)
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      )
  }
}
