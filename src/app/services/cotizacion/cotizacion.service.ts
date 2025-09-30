import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

const IVA_RATE = 0.16;

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private itemsSubject = new BehaviorSubject<any[]>([]);
  public items$ = this.itemsSubject.asObservable();

  public subtotal$: Observable<number>;
  public iva$: Observable<number>;
  public total$: Observable<number>;

  constructor() {
    this.subtotal$ = this.items$.pipe(
      map((items) =>
        items.reduce(
          (acc, item) => acc + item.cantidad * item.n_precio_venta,
          0
        )
      )
    );

    this.iva$ = this.subtotal$.pipe(map((subtotal) => subtotal * IVA_RATE));

    this.total$ = this.subtotal$.pipe(
      map((subtotal) => subtotal * (1 + IVA_RATE))
    );
  }

  agregarItem(refaccion: any) {
    const itemsActuales = this.itemsSubject.getValue();
    const itemExistente = itemsActuales.find(
      (item) => item.id_refaccion === refaccion.id_refaccion
    );

    if (!itemExistente) {
      const nuevoItem = { ...refaccion, cantidad: 1 };
      this.itemsSubject.next([...itemsActuales, nuevoItem]);
    } else {
      this.incrementarCantidad(refaccion.id_refaccion);
    }
  }

  incrementarCantidad(idRefaccion: number) {
    const itemsActuales = this.itemsSubject.getValue();
    const nuevosItems = itemsActuales.map((item) => {
      if (item.id_refaccion === idRefaccion) {
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
    this.itemsSubject.next(nuevosItems);
  }

  decrementarCantidad(idRefaccion: number) {
    const itemsActuales = this.itemsSubject.getValue();
    let nuevosItems = itemsActuales.map((item) => {
      if (item.id_refaccion === idRefaccion && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    });

    const item = nuevosItems.find((i) => i.id_refaccion === idRefaccion);
    if (item && item.cantidad <= 1) {
      this.eliminarItem(idRefaccion);
    } else {
      this.itemsSubject.next(nuevosItems);
    }
  }

  eliminarItem(idRefaccion: number) {
    const itemsActuales = this.itemsSubject.getValue();
    const nuevosItems = itemsActuales.filter(
      (item) => item.id_refaccion !== idRefaccion
    );
    this.itemsSubject.next(nuevosItems);
  }

  obtenerItems() {
    return this.itemsSubject.getValue();
  }
  vaciarCotizacion() {
    this.itemsSubject.next([]);
  }
}
