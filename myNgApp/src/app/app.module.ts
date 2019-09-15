import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//Material
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';

//Components
import { AppComponent } from './app.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { SampleOcrComponent } from './components/sample-ocr/sample-ocr.component';
import { OrdersAuctionComponent } from './components/orders-auction/orders-auction.component';

//Services
import { OrderService } from './services/order.service';
import { OrdersListService } from './services/orders-list.service';
import { OrderDataService } from './services/order-data.service';
import { QuickOcrService } from './services/quick-ocr.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { FileDownloadService } from './services/file-download.service';

import { tokenInterceptor } from './helpers/token-interceptor';
import { WorkSpaceComponent } from './components/work-space/work-space.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolBarComponent,
    FileUploadComponent,
    routingComponents,
    SignupFormComponent,
    LoginFormComponent,
    OrderDetailsComponent,
    OrderFormComponent,
    SampleOcrComponent,
    ManageOrdersComponent,
    OrdersAuctionComponent,
    WorkSpaceComponent
    
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatBadgeModule
  ],
  providers: [FileDownloadService, OrdersListService, OrderService, OrderDataService, QuickOcrService, AuthService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: tokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
