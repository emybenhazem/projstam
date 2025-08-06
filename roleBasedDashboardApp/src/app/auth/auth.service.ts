import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // ✅ ici

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Auth'; // ⚠️ adapte si nécessaire

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }



  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.clear();
  }

  saveToken(token: string) {
  localStorage.setItem('token', token);
  const decoded: any = jwtDecode(token);
  if (decoded?.role) {
    this.saveRole(decoded.role); // on extrait et sauvegarde le rôle
  }
}
getRoleFromToken1(): string {
  const token = localStorage.getItem('token');
  if (!token) return '';

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role;
}

getRoleFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // 💡 Détection souple : prend en compte deux formats possibles
    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload['role'] ||
      null;

    if (role && typeof role === 'string') {
      const cleanedRole = role.trim().toLowerCase();
      console.log('✅ Décodé depuis le token (nettoyé) :', cleanedRole);
      return cleanedRole;
    }

    console.warn('❗ Le rôle est manquant ou mal formé dans le token');
    return null;
  } catch (e) {
    console.error('❌ Erreur de décodage du token :', e);
    return null;
  }
}




// auth.service.ts


}
