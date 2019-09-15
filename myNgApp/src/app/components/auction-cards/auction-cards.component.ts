import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auction-cards',
  templateUrl: './auction-cards.component.html',
  styleUrls: ['./auction-cards.component.css']
})
export class AuctionCardsComponent implements OnInit {

  docsArray = [
    { "name": "out.png", "imgPath": "/assets/outprod.jpg", "price": 11 ,"timeLeft": 1563041835 ,"numberPages": 1, "createdTime": 1568041990, "fileSize": 24, "numChars": 5000, "estWorkTime": 4},
    { "name": "outprod.jpg", "imgPath": "/assets/outprod.jpg", "price": 12, "timeLeft": 1563041335, "numberPages": 2, "createdTime": 1568041990, "fileSize": 300, "numChars": 1200, "estWorkTime": 7 },
    { "name": "wikiOcr.png", "imgPath": "/assets/wikiOcr.png", "price": 9, "timeLeft": 1563041845, "numberPages": 3, "createdTime": 1568041990, "fileSize": 58, "numChars": 300, "estWorkTime": 2}
  ];
  // name
  // worth $$$
  // filePath
  // timeLeft
  // number of pages
  // created time
  // file size
  // number of characters
  // estimated work time


  constructor() { }

  ngOnInit() {
  }

}
