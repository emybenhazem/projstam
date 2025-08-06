import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // ✅ Bien importer CUSTOM_ELEMENTS_SCHEMA
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { Poste1Component } from './dashboards/poste1/poste1.component';
import { Poste2Component } from './dashboards/poste2/poste2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddReferenceComponent } from './dashboards/add-reference/add-reference.component';
import { AddTaskComponent } from './dashboards/add-task/add-task.component';
import { QrCodeScanComponent } from './dashboards/qr-code-scan/qr-code-scan.component';
import { ListTaskComponent } from './dashboards/list-task/list-task.component';
import { TaskComponent } from './dashboards/task/task.component';
import { GroupTacheComponent } from './dashboards/group-tache/group-tache.component';
import { TaskAssignmentsComponent } from './dashboards/task-assignments/task-assignments.component';
import { ScannerComponent } from './dashboards/scanner/scanner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    Poste1Component,
    Poste2Component,
    SidebarComponent,
    MainLayoutComponent,
    UnauthorizedComponent,
    AddReferenceComponent,
    AddTaskComponent,
    QrCodeScanComponent,
    ListTaskComponent,
    TaskComponent,
    GroupTacheComponent,
    TaskAssignmentsComponent,
    ScannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Autorise les composants Web personnalisés comme ngx-scanner-qrcode
})
export class AppModule { }
