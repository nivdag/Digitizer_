import { Component, OnInit } from '@angular/core';
import { OrdersListService } from '../../services/orders-list.service';
import { Order } from 'src/app/models/Order';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Documentdetails } from 'src/app/models/Documentdetails';
import { OrderService } from 'src/app/services/order.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {

  interval: any;

  documents: Documentdetails[]
  pendingDocs: Documentdetails[] = []
  authorizedDocs: Documentdetails[] = []

  constructor(private _fileDownloadService: FileDownloadService, private _ordersService: OrderService, private _orderListService: OrdersListService, private _router: Router) { }

  updateData() {
    this.pendingDocs = [];
    this.authorizedDocs = [];
    this.documents.forEach((doc) => {
      if (doc.userAccepted == false && doc.price > 0) {
        this.pendingDocs.push(doc)
      } else {
        this.authorizedDocs.push(doc)
      }
    })
  }

  authorizeThisDocument(index) {
    var body = {
      'userAccepted': true
    }

    this._ordersService.updateDocument(this.pendingDocs[index]._id, body)
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      )
  }

  deleteThisDocument(index) {
    this._ordersService.deleteDocument(this.pendingDocs[index]._id)
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      )
  }

  
  downloadResultFile(index) {
    this._fileDownloadService.downloadOcr(this.authorizedDocs[index]._id)
      .subscribe(
        data => saveAs(data, 'result'),
        error => console.log(error)
      );
  }

  checkUpdate() {
    this._orderListService.getAllDocuments()
      .subscribe(
        res => {
          this.documents = res.response.documentsArr
          this.updateData();
        },
        //err => console.log(err)
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._router.navigate(['/login'])
            }
          }
        }
      )
  }

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



}
