import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginlayoutRoutingModule } from './loginlayout-routing.module';
import { LoginlayoutComponent } from './loginlayout.component';
import { LoginComponent } from '../login.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroControlsdModule  } from '../ng.zorro.controls.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HttpClientModule } from '@angular/common/http';
import {AuthService} from '../core/services/auth.services'
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
@NgModule({
  declarations: [
    LoginlayoutComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginlayoutRoutingModule,
    DragDropModule,
    HttpClientModule,
    NzIconModule,
     NzButtonModule,
     NgZorroControlsdModule,
     NzSpinModule,
     FlexLayoutModule,
  ],
  providers: [AuthService, { provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons }],
})
export class LoginlayoutModule { }
