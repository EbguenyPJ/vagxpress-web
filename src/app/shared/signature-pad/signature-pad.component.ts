import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2';
import { PivotService } from 'app/services/local/pivot.service';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [],
  templateUrl: './signature-pad.component.html',
  styleUrl: './signature-pad.component.scss'

})

export class SignaturePadComponent implements AfterViewInit, OnDestroy
{
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;


  constructor(private PivotService: PivotService){

  }


  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.resizeCanvas(canvas);
    this.signaturePad = new SignaturePad(canvas);
  }

  ngOnDestroy(): void {
    this.signaturePad?.off();
  }

  clear(): void {
    this.signaturePad.clear();
  }

  save(): void {
    if (this.signaturePad.isEmpty()) {
      Swal.fire('Advertencia', 'Por favor, firme antes de guardar..', 'warning');

    } else {
      const dataUrl = this.signaturePad.toDataURL(); // base64 image

      this.enviarDatosAlServicio([dataUrl]);
      Swal.fire('', '¡Firma guardada correctamente!', 'success');
      //console.log('Firma guardada:', dataUrl);
    }
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
  }



  enviarDatosAlServicio(datos:any)
  {
    this.PivotService.setArrayDatos(datos);
  }




}
