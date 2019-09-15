import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  isEmp = false
  constructor(private _authService: AuthService) { }

  ngOnInit() {
    var role = this._authService.getRole()
    if(role === 'Admin' || role === 'Seller')
      this.isEmp = true;
  }

}
