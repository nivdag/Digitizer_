import { Component, OnInit } from '@angular/core';
import { QuickOcrService } from 'src/app/services/quick-ocr.service';

@Component({
  selector: 'app-sample-ocr',
  templateUrl: './sample-ocr.component.html',
  styleUrls: ['./sample-ocr.component.css']
})
export class SampleOcrComponent implements OnInit {
  fd = new FormData();
  selectedFile = null;
  url = '';
  textFromOcr = '';

  constructor(private _ocrService: QuickOcrService) { }

  ngOnInit() {
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

    this.selectedFile = <File>event.target.files[0];
    this.fd.append('file', this.selectedFile, this.selectedFile.name);

    this._ocrService.quickOcr(this.fd).subscribe(
      data => this.textFromOcr = data.message,
      error => console.log('error ocr service')
    )

    this.fd.delete('file');
  }

}
