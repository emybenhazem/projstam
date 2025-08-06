import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
 role: string | null = '';
username : string = ''; // Vous pouvez remplacer par une logique pour obtenir le nom d'utilisateur
userRole: string | null = '';
poste  : any = null; // Placeholder for poste data, if needed

posteRoutes = [
  { name: 'Place 1', route: '/dashboard/app-machine-screen/machine/1', role: 'poste1' },
  { name: 'Place 2', route: '/dashboard/app-machine-screen/machine/2', role: 'poste2' },
  { name: 'Place 3', route: '/dashboard/app-machine-screen/machine/3', role: 'poste3' },
  { name: 'Place 4', route: '/dashboard/app-machine-screen/machine/4', role: 'poste4' },
  { name: 'Place 5', route: '/dashboard/app-machine-screen/machine/5', role: 'poste5' },
  { name: 'Poste 2', route: '/dashboard/Poste2Screen/machine/2', role: 'poste2' },

];

  userPlace: string = '';
  userMachineRoute: string = '';
  posteId: string = '';

  constructor(private authService: AuthService, private router: Router) {}

ngOnInit() {
  this.userRole = this.authService.getRoleFromToken(); // ✅ Rôle correct
  this.role = this.userRole;
  console.log('🔐 Rôle dans Sidebar:', this.role);
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
 isPosteUser(): boolean {
    return this.userRole?.startsWith('poste') ?? false;
  }
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
  getPosteNumber(): string {
  return this.userRole?.replace('poste', '') ?? '';
}
  }
