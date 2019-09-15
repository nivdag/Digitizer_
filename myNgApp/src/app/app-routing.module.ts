import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OrderComponent } from './components/order/order.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { AuthGuard } from './services/auth.guard';
import { OrdersAuctionComponent } from './components/orders-auction/orders-auction.component';
import { AuctionCardsComponent } from './components/auction-cards/auction-cards.component';
import { WorkSpaceComponent } from './components/work-space/work-space.component';

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
    { path: 'signup', component: SignupFormComponent},
    { path: 'login', component: LoginFormComponent},
    { path: 'manage-orders', component: ManageOrdersComponent, canActivate: [AuthGuard]},
    { path: 'auction', component: OrdersAuctionComponent, canActivate: [AuthGuard]},
    { path: 'work-space', component: WorkSpaceComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [HomeComponent, OrderComponent]
