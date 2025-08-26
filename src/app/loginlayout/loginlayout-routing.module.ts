import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminlayoutComponent } from '../modules/admin/adminlayout.component';
import {AuthService} from '../core/services/auth.services'
import { LoginlayoutComponent } from './loginlayout.component';


const routes: Routes = [
  { path: '',   component: AdminlayoutComponent ,   loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule)  },  
  { path: 'admin',   component: AdminlayoutComponent ,   loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),  canActivate:[AuthService]   },  

 {  path: 'logout', component: LoginlayoutComponent, loadChildren: () => import('./loginlayout.module').then(m => m.LoginlayoutModule)  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginlayoutRoutingModule { }
