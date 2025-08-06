import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

 ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f() {
    return this.loginForm.controls;
  }

onLogin(): void {
  if (this.loginForm.invalid) return;

  const { username, password } = this.loginForm.value;

  this.authService.login(username, password).subscribe({
    next: (response: { token: string }) => {  // ✅ type ici
      const token = response.token;
      this.authService.saveToken(token);

      const role = this.authService.getRoleFromToken();

      if (!role) {
        this.router.navigate(['/unauthorized']);
        return;
      }

      switch (role) {
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        case 'poste1':
          this.router.navigate(['/poste1']);
          break;
        case 'poste2':
          this.router.navigate(['/poste2']);
          break;
        case 'poste3':
          this.router.navigate(['/poste3']);
          break;
        case 'poste4':
          this.router.navigate(['/poste4']);
          break;
        case 'poste5':
          this.router.navigate(['/poste5']);
          break;
        default:
          this.router.navigate(['/unauthorized']);
      }
    },
    error: (err) => {
      console.error('Erreur de connexion :', err);
      alert('Identifiants incorrects.');
    }
  });
}


  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


  // Convenience getter for easy access to form fields









