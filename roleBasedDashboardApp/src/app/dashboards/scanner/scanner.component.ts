import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReferencePiece } from 'src/models/ReferencePiece';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { MachineService } from 'src/Service/machine.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements AfterViewInit  {
 referenceForm: FormGroup;
  scannedValues: string[] = [];  // Initialisation comme un tableau vide
  scannedValue: any;
  action = {
    isStart: false,
    isLoading: false,
    data: null
  };
  scannedReference: string | null = null;
  addSuccess: boolean = false;
  addError: boolean = false;
  scannedCodes : any
  value: any
  pieces: ReferencePiece[] = [];

 currentPiece: ReferencePiece = {
  id: 0,
  code: '',
  nom: '', // ✅ Ajouté pour respecter l'interface
  tasks: []
};

  // Référence directe au composant du scanner
  @ViewChild('action') scanner!: NgxScannerQrcodeComponent;

  http: any;

  constructor(private fb: FormBuilder , private dataSerive  : MachineService  , private QrCodeDataService :MachineService) {
    this.referenceForm = this.fb.group({
      matricule: ['']
    });
  }
    ngOnInit() {
      this.loadScannedCodes

   }
   barcode: string = '';






  addReference() {
    if (!this.currentPiece.code.trim()) {
      alert("Le code est obligatoire !");
      return;
    }

    this.pieces.push({ ...this.currentPiece });
    this.currentPiece = {
      id: 0,
  code: '',
  nom: '', // ✅ Ajouté pour respecter l'interface
  tasks: []
    };
  }

  submitAll() {
    this.dataSerive.addReferencePieces(this.pieces).subscribe({
      next: () => {
        alert("Références enregistrées !");
        this.pieces = [];
      },
      error: (err) => {
        alert("Erreur lors de l'envoi : " + err.message);
      }
    });
  }



  scanError: string | null = null;

  // Méthode déclenchée lors d'un scan réussi
  onScanSuccess(value: string) {
    this.scannedValue = value;
    this.scanError = null; // Réinitialiser les erreurs, le scan est réussi
  }

  // Méthode déclenchée en cas d'erreur de scan
  onScanError(error: any) {
    this.scanError = error;
    this.scannedValue = null; // Réinitialiser la valeur scannée en cas d'erreur
  }
  startStopScanner() {
    if (this.action.isStart) {
      this.stopScanner();
    } else {
      this.startScanner();
    }
  }

  startScanner() {
    this.action.isLoading = true;
    this.action.isStart = true;
  }

  stopScanner() {
    this.action.isLoading = false;
    this.action.isStart = false;
  }

  // Méthode appelée lors de la capture d'un QR code
  onQRCodeScanned(value: any) {
    this.scannedReference = value;  // Enregistrer la référence scannée
  }

  ngAfterViewInit() {
    // S'abonne aux valeurs scannées dès qu'elles sont détectées
    this.scanner.data.subscribe((data: ScannerQRCodeResult[]) => {
      data.forEach(result => {
        const codeValue = result.value; // Extrait la valeur scannée
        if (codeValue) {
          this.scannedValue = codeValue; // Met à jour la valeur scannée
          // Ajoute la valeur scannée à la liste si elle est unique
          if (!this.scannedValues.includes(codeValue)) {
            this.scannedValues.push(codeValue);
          }
        }
      });
    });
  }

  // Méthode pour démarrer/arrêter le scanner
  toggleScanner(action :any ) {
    if (this.scanner.isStart) {
      this.scanner.stop();
    } else {
      this.scanner.start();
    }
  }

  referenceList: string[] = []; // Liste pour stocker les références scannées

  onBarcodeScan(barcodeData: any): void {
    const reference = barcodeData?.value; // Extraire la référence scannée

    if (reference) {
      this.referenceList.push(reference); // Ajouter à la liste
      console.log('Référence ajoutée :', reference);
      console.log('Liste des références :', this.referenceList);
    } else {
      console.error("Aucune référence trouvée dans les données scannées.");
    }
  }


  onValueCaptured(value: string) {
    this.scannedValue = value;
    console.log("Valeur envoyée :", value);

  }


  getScannedCodes() {
    this.QrCodeDataService.getScannedCodes().subscribe(
      (data) => {
        this.scannedCodes = data;
        console.log('QR Codes scannés:', this.scannedCodes); // Affiche les données reçues
      },
      (error) => {
        console.error('Erreur lors du chargement des QR codes scannés', error);
        // Vous pouvez également loguer l'erreur pour plus de détails
        console.log('Détails de l\'erreur:', error);
      }
    );
  }

  onValueScanned(): void {
    if (this.scannedValue.trim()) {
      console.log('Valeur scannée :', this.scannedValue);
      this.addScannedValueToDB();
    }
  }

  handleScanError(error: any) {
    if (error.name === 'NotReadableError') {
      this.scanError = 'La caméra est déjà utilisée par une autre application ou n\'est pas accessible.';
    } else {
      this.scanError = 'Erreur lors de l\'accès à la caméra : ' + error.message;
    }
  }

  // Fonction pour capturer les valeurs scannées
  /* deleteReference(id: number) {
    this.dataSerive.deleteReference(id).subscribe(
      () => {
        console.log("Référence supprimée avec succès :", id);
        this.scannedValues = this.scannedValues.filter((reference: ReferencePiece) => reference.id !== id);
      },
      (error) => {
        console.error("Erreur lors de la suppression :", error);
      }
    );
  } */

    loadScannedCodes(): void {
      this.QrCodeDataService.getScannedCodes().subscribe(
        (data) => {
          this.scannedCodes = data;
          console.log('QR Codes reçus:', this.scannedCodes); // Affiche les données dans la console
        },
        (error) => {
          console.error('Erreur lors du chargement des QR codes scannés', error);
        }
      );
    }

    addScannedValueToDB(): void {
      if (this.scannedValue.trim()) {
        this.scannedValues.push(this.scannedValue.trim());
        this.addSuccess = true;
        this.addError = false;
        this.scannedValue = ''; // Réinitialiser le champ d'entrée
      } else {
        this.addSuccess = false;
        this.addError = true;
      }
    }


}


