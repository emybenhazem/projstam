import { Component } from '@angular/core';
interface Tache {
  nom: string;
  temps: number; // en secondes
  timerId?: any;
  terminee?: boolean; // ✅ On ajoute cette propriété optionnelle

}
@Component({
  selector: 'app-poste1',
  templateUrl: './poste1.component.html',
  styleUrls: ['./poste1.component.css']
})

export class Poste1Component {

title = 'task';
  ot: string = '';
  item: number = 0;
  tempsRestant: number = 60; // par exemple, 60 secondes
  intervalId: any;
  tasks: Tache[] = [];
  nouvelleTache = { nom: '', temps: 0 };
  tempsTotal = 0;
  secondesS: number = 0;
  minutesTache = 0;
  secondesTache = 0;
  compteur = 0; // en secondes

  ngOnInit(): void {
    const saved = localStorage.getItem('taches');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
    this.startCountdown();

    this.calculerTempsTotal();
    this.compteur = this.tempsTotal * 60;
    this.startTimer();
    const savedOT = localStorage.getItem('ot');
    const savedItem = localStorage.getItem('item');

    if (savedOT) this.ot = savedOT;
    if (savedItem) this.item = +savedItem;
    this.intervalId = null; // Réinitialise l’état du timer au démarrage
this.lancerTimerGlobal()
  }

  get minutes(): number {
    return Math.floor(this.compteur / 60);
  }

  get secondes(): number {
    return this.compteur % 60;
  }

  saveOT() {
    localStorage.setItem('ot', this.ot);
  }
// compteur is already in seconds
get totalSeconds(): number {
  return this.compteur;
}

  saveItem() {
    localStorage.setItem('item', this.item.toString());
  }
  ajouterTache(): void {
    if (!this.nouvelleTache.nom || !this.nouvelleTache.temps) {
      return;  // S'assurer que le nom et le temps sont renseignés
    }

    const tache = {
      nom: this.nouvelleTache.nom,
      temps: this.nouvelleTache.temps, // Laisser le temps en minutes
      terminee: false // <-- ici

    };

    // Ajouter la tâche à la liste
    this.tasks.push(tache);
    this.tempsTotal += tache.temps; // Mettre à jour le temps total
    this.compteur += tache.temps; // Ajouter au compteur global

    // Réinitialiser les champs de saisie
    this.nouvelleTache = { nom: '', temps: 0 };

    if (!this.intervalId) {
      this.lancerTimerGlobal();
      this.startCountdown
    }
    this.startTimer();  // Démarrer le timer si ce n'est pas déjà fait
    console.log('Compteur après ajout de tâche :', this.compteur);

  }
  lancerDecompte(tache: Tache): void {
    tache.timerId = setInterval(() => {
      if (tache.temps > 0) {
        tache.temps--;
      } else {
        clearInterval(tache.timerId);
        tache.terminee = true; // ✅ Marque comme terminée
        // this.supprimerTache(tache); // tu peux commenter ça si tu veux garder l'affichage
      }
    }, 1000);
  }

  startTimer(): void {
    if (this.intervalId) return; // Si l'intervalle existe déjà, on ne le relance pas.

    this.intervalId = setInterval(() => {
      if (this.compteur > 0) {
        this.compteur--;  // Décrémenter de 1 seconde
      } else {
        clearInterval(this.intervalId); // Arrêter l'intervalle quand il atteint 0
        this.intervalId = null; // Libérer l'intervalle pour d'autres utilisations
      }
    }, 1000);  // Intervalle de 1 seconde
  }
formatTimeMMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const secondes = totalSeconds % 60;

  const m = minutes < 10 ? '0' + minutes : minutes;
  const s = secondes < 10 ? '0' + secondes : secondes;

  return `${m}.${s}`;
}

lancerTimerGlobal(): void {
  console.log('🟢 lancerTimerGlobal() appelée'); // Ajout ici !

  this.intervalId = setInterval(() => {
    if (this.compteur > 0) {
      this.compteur--;
      console.log('Compteur décrémenté :', this.compteur);
    } else {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⛔️ Fin du timer');
    }
  }, 1000);
}

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  formatTime(val: number): string {
    return val < 10 ? '0' + val : val.toString();
  }
  get displayTime(): string {
    const m = Math.floor(this.compteur / 60);
    const s = this.compteur % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }



  calculerTempsTotal(): void {
    this.tempsTotal = this.tasks.reduce((acc, t) => acc + t.temps, 0);
  }

  supprimerTache(tache: any): void {
    const index = this.tasks.indexOf(tache);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.tempsTotal -= tache.temps;
      this.compteur -= tache.temps;

      // S'assurer que le compteur ne devient pas négatif
      if (this.compteur < 0) this.compteur = 0;
    }
  }

  get displayFullTime(): string {
    const h = Math.floor(this.compteur / 3600);
    const m = Math.floor((this.compteur % 3600) / 60);
    const s = this.compteur % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }

  startCountdown(): void {
    // Si un intervalle existe déjà, on le nettoie avant de démarrer un nouveau
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Décrémenter le temps toutes les secondes
    this.intervalId = setInterval(() => {
      if (this.tempsRestant > 0) {
        this.tempsRestant--;
      } else {
        clearInterval(this.intervalId);  // Arrêter le compte à rebours lorsque le temps est écoulé
      }
    }, 1000);  // Intervalle de 1 seconde
  }





}
