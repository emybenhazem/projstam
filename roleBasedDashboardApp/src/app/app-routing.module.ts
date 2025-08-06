import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { Poste1Component } from './dashboards/poste1/poste1.component';
import { Poste2Component } from './dashboards/poste2/poste2.component';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import {  RoleGuard } from './guards/role.guard'; // ✔️ Fonction bien exportée

import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AddReferenceComponent } from './dashboards/add-reference/add-reference.component';
import { AddTaskComponent } from './dashboards/add-task/add-task.component';
import { TaskComponent } from './dashboards/task/task.component';
import { ListTaskComponent } from './dashboards/list-task/list-task.component';
import { ScannerComponent } from './dashboards/scanner/scanner.component';
import { QrCodeScanComponent } from './dashboards/qr-code-scan/qr-code-scan.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
{
  path: 'poste1',
  component: Poste1Component,
  canActivate: [RoleGuard],
  data: { expectedRoles: ['poste1'] }
},

{
  path: 'poste2',
  component: Poste2Component,
    canActivate: [RoleGuard],

  data: { expectedRoles: ['poste2'] }
},
{
  path: 'add-reference',
  component: AddReferenceComponent,
    canActivate: [RoleGuard],

  data: { expectedRoles: ['admin','poste2'] }
},
{
  path: 'add-task',
  component: AddTaskComponent,
    canActivate: [RoleGuard],

  data: { expectedRoles: ['admin'] }
},
{
  path: 'task',
  component: TaskComponent,
    canActivate: [RoleGuard],

  data: { expectedRoles: ['admin'] }
},{
  path: 'list-task',
  component: ListTaskComponent,
    canActivate: [RoleGuard],

  data: { expectedRoles: ['admin'] }
},
{
  path: 'add-ref',
  component: ScannerComponent,
  canActivate: [RoleGuard],
  data: { expectedRoles: ['admin', 'poste1', 'poste2',] }
},
{
  path: 'qr-code-scan',
  component: QrCodeScanComponent,
  canActivate: [RoleGuard],
  data: { expectedRoles: ['admin', 'poste1', 'poste2',] }
},
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [RoleGuard],
  data: { expectedRoles: ['admin', 'poste1', 'poste2',] }
}
,

 { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'unauthorized' }, // facultatif
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
