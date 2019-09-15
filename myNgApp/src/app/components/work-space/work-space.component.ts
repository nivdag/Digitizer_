import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Documentdetails } from 'src/app/models/Documentdetails';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.css']
})
export class WorkSpaceComponent implements OnInit {

  constructor(private _orderService: OrderService, private _fileDownloadService: FileDownloadService, private _router: Router) { }

  userName;
  docInfo = {};
  fileSizeString;
  fname;
  imageToShow: any;
  isImageLoading = true;
  isPdf = false;
  selectedFile = null;

  docData: {
    userName: string, docInfo: {
      price: number,
      fileSize: number,
      timeLeft: number,
      priority: string,
      extension: string,
      fileName: string
    };
  }

  _doc;


  ngOnInit() {
    this.getUserDocInfo()

  }

  getUserDocInfo() {
    this._orderService.getWorkSpace()
      .subscribe(doc => {
        this._doc = doc;
        this.userName = this._doc.userName;
        this.fileSizeString = this.humanFileSize(this._doc.docInfo.fileSize, true);
        this.fname = this._doc.docInfo.fileName;
        if (this.fname.split('.').pop() === ".pdf")
          this.isPdf = true;
        this.docInfo = this._doc.docInfo;
      },
        error => console.log(error))
  }

  download(id) {
    this.isImageLoading = true;

    this._fileDownloadService.downloadFile(id)
      .subscribe(
        data => {
          saveAs(data, this.fname)

          this.createImageFromBlob(data);
          this.isImageLoading = false;

        },
        error => {
          this.isImageLoading = false;
          console.log(error);
        }
      );
  }

  downloadOcrFile(id) {
    this._fileDownloadService.downloadOcr(id)
      .subscribe(
        data => saveAs(data, this.fname.split('.')[0] + '_OCR.txt'),
        error => console.log(error)
      );
  }

  humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    var units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onSelectFile(event) {

    this.createImageFromBlob(<File>event.target.files[0])
    this.isImageLoading = false;

  }

  onSelectedResult(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  submitResult() {
    var fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this._orderService.uploadResult(fd).subscribe(
      data => {
        console.log(data)
        this._router.navigate(['/manage-orders'])
      },
      error => console.log(error)
    )
  }


}
