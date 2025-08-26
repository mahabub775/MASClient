import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  FullscreenOutline,
  FullscreenExitOutline,
  EyeOutline,
  StockOutline,
  PlusOutline,
  LogoutOutline,
  KeyOutline,
  ArrowLeftOutline,
  MailOutline,
  LockOutline,
  AuditOutline,
  RedoOutline,
  BarChartOutline,
  ImportOutline,
  ClearOutline,
  DownloadOutline,
  EyeInvisibleOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
  FullscreenOutline,
  FullscreenExitOutline,
  EyeOutline,
  StockOutline,
  PlusOutline,
  LogoutOutline,
  KeyOutline,
  ArrowLeftOutline,
  MailOutline,
  LockOutline,
  AuditOutline,
  RedoOutline,
  BarChartOutline,
  ImportOutline,
  ClearOutline,
  DownloadOutline,
  EyeInvisibleOutline
];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconProviderModule { }
