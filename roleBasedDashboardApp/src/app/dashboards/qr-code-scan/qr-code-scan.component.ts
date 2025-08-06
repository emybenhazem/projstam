import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReferencePiece } from 'src/models/ReferencePiece';
import { MachineService } from 'src/Service/machine.service';

@Component({
  selector: 'app-qr-code-scan',
  templateUrl: './qr-code-scan.component.html',
  styleUrls: ['./qr-code-scan.component.css']
})
export class QrCodeScanComponent {
  @ViewChild('codeInput') codeInput!: ElementRef;

  currentCode: string = '';
  pieces: ReferencePiece[] = [];

  constructor(private referenceService: MachineService) {}

  submitAll(): void {
    if (this.pieces.length === 0) {
      console.warn('⚠️ Aucune pièce à soumettre.');
      return;
    }

    console.log('🚀 Envoi des références au backend :', this.pieces);

    this.referenceService.addReferencePieces(this.pieces).subscribe({
      next: () => {
        alert('✅ Références envoyées avec succès !');
        console.log('✅ Références envoyées avec succès !');
        this.pieces = [];
        this.codeInput.nativeElement.focus();
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'envoi :', err);
        alert('❌ Erreur : ' + err.message);
      }
    });
  }
  addReference(): void {
  const code = this.currentCode.trim();
  if (!code) return;

  const newRef: ReferencePiece = {
    id: 0,
    code: code,
    totalExecutionTime: '00:00:00',
    nom: '',
    tasks: []
  };

  this.pieces.push(newRef);

  console.log('✅ Nouvelle référence ajoutée:', newRef); // 👈 Confirmation console

  this.currentCode = '';
  this.codeInput.nativeElement.focus();
}
addReference1(): void {
  const code = this.currentCode.trim();
  if (!code) return;

  const newRef: ReferencePiece = {
    id: 0,
    code: code,
    totalExecutionTime: '00:00:00',
    nom: '',
    tasks: []
  };

  // Ajouter à la liste
  this.pieces.push(newRef);

  console.log('✅ Nouvelle référence ajoutée:', newRef);

  // Nettoyer le champ
  this.currentCode = '';

  // Focaliser de nouveau sur l’input
  this.codeInput.nativeElement.focus();
}
nvoyerVersServeur(): void {
    this.referenceService.addReferencePieces(this.pieces).subscribe({
      next: (res) => {
        console.log('✅ Références envoyées avec succès !', res);
        this.pieces = []; // vider la liste après envoi
      },
      error: (err) => {
        console.error('❌ Erreur lors de l’envoi des références :', err);
      }
    });
  }
}
