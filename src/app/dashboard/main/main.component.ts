import { Component, ViewChild } from '@angular/core';
import {
  ApexTitleSubtitle,
  ApexMarkers,
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { dataSeries } from './chartdata';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from 'app/services/dashboard/dashboard.service';
import { NewOrderListComponent } from '@shared/components/new-order-list/new-order-list.component';
import { DocumentListComponent } from '@shared/components/document-list/document-list.component';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';
import { CommonModule } from '@angular/common';

export type chartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  plotOptions: ApexPlotOptions;
  labels: string[];
  responsive: ApexResponsive[];
};
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    NgApexchartsModule,
    MatTooltipModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    NgxGaugeModule,
    NgScrollbar,
    MatButtonModule,
    NewOrderListComponent,
    DocumentListComponent,
    TableCardComponent,
    CommonModule
  ],
})
export class MainComponent {
  totalOrdenes: number = 0;
  totalOrdenesReparto: number = 0;
  totalOrdenesCompraHoy: number = 0;
  totalRequisicionesAprobadasHoy: number = 0;
  topClientes: any[] = [];
  topRefaccionesCriticas: any[] = [];
  topMas: any[] = [];
  topMenos: any[] = [];
  acumuladoVentasHoy: number = 0;

  fechaHoraActual!: Date;
  private intervaloId!: any;

  ventasPorMetodoHoy: any[] = [];
  topRefaccionistas: any[] = [];

  public topProveedoresChartOptions: any;






  @ViewChild('chart') chart?: ChartComponent;
  public areaChartOptions!: Partial<chartOptions>;
  public barChartOptions!: Partial<chartOptions>;
  public circleChartOptions!: Partial<chartOptions>;
  public pieChartOptions!: Partial<chartOptions>;

  gaugeType = 'arch' as NgxGaugeType;
  gaugeValue = 48;
  gaugeSize = 170;
  guageThick = 16;
  thresholdConfig = {
    0: { color: 'green' },
    40: { color: 'orange' },
    75.5: { color: 'red' },
  };

  gaugeType2 = 'arch' as NgxGaugeType;
  gaugeValue2 = 34;
  gaugeSize2 = 170;
  guageThick2 = 16;
  thresholdConfig2 = {
    0: { color: 'green' },
    40: { color: 'orange' },
    75.5: { color: 'red' },
  };

  constructor(private DashboardService: DashboardService) {
    //this.chart1();
    this.chartVentas();
    this.chart2();
    this.smallChart();
    this.smallChart2();
    this.TopProveedoresActivosChart();
  }

  ngOnInit(): void {
    this.fechaHoraActual = new Date();
    this.intervaloId = setInterval(() => {
      this.fechaHoraActual = new Date();
    }, 1000);

    this.cargarTotalOrdenes();
    this.cargarOrdenesEnRepartoHoy();
    this.cargarOrdenesCompraHoy();
    this.cargarRequisicionesAprobadasHoy();
    this.cargarTopClientes();
    this.cargarAcumuladoVentasHoy();
    this.cargarTopRefaccionistas();
    this.TopRefaccionesCriticas();
  }




  private chartVentas(): void {

    this.DashboardService.getVentasPagadasPorDia().subscribe((data: [number, number][]) => {

      setTimeout(() => {
        this.chart?.updateOptions(this.areaChartOptions!, true, true);
      }, 100);

      this.areaChartOptions = {
        series: [
          {
            name: 'Ventas pagadas',
            data: data
          }
        ],
        chart: {
          type: 'area',
          stacked: false,
          height: 250,
          toolbar: {
            show: true
          },
          foreColor: '#fefcfcff'
        },
        colors: ['#e53935'], // 🔴 rojo
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0
          }
        },
        stroke: {
          curve: 'smooth'
        },
        yaxis: {
          labels: {
            formatter: (val: number) => val.toFixed(0)
          },
          title: {
            text: 'Ventas'
          }
        },
        xaxis: {
          type: 'datetime',
          min: new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime(),
          max: new Date().getTime(),
          labels: { datetimeUTC: true }
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'center'
        },
        tooltip: {
          theme: 'dark',
          marker: {
            show: true
          },
          x: {
            show: true
          },
          y: {
            formatter: (val: number) => val.toFixed(0)
          }
        }
      };

    });
  }



private chart2() {
  const token = localStorage.getItem('token') || '';

  this.DashboardService.getTop5RefaccionesVendidas().subscribe((resp: any) => {
    if (resp) {
      this.topMas = resp.top_mas;     // top 5 más vendidos
      this.topMenos = resp.top_menos; // top 5 menos vendidos

      this.barChartOptions = {
        series: [
          {
            name: 'Más Vendidos',
            data: this.topMas.map(item => +item.total_vendida),
          },
        ],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,      // barras verticales
            columnWidth: '50%',
            borderRadius: 5,        // bordes redondeados
          },
        },
        colors: ['#FF4C4C'],       // color rojo uniforme
        dataLabels: {
          enabled: true,            // mostrar números en las barras
          style: {
            colors: ['#ffffff'],    // color de los números dentro de las barras (blanco)
            fontWeight: 'bold',
          },
          formatter: (val: number) => val.toString()
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: this.topMas.map(item => item.s_nombre_refaccion),
        },
        yaxis: {
          title: { text: 'Cantidad Vendida' },
        },
        legend: { show: false },
        tooltip: {
          y: {
            formatter: (val: number) => val + ' unidades',
          },
        },
      };
    }
  });
}








  private smallChart() {
    this.circleChartOptions = {
      series2: [76, 67, 61, 90],
      chart: {
        height: 260,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ['#569C4D', '#72B1AC', '#EA8A2A', '#4772A0'],
      labels: ['Data 1', 'Data 2', 'Data 3', 'Data 4'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    };
  }



  private smallChart2() {
    const token = localStorage.getItem('token') || '';

    this.DashboardService.getVentasMetodosPagosHoy().subscribe({
      next: (resp: any) => {
        if (resp && resp.ventas_por_metodo_pago_hoy) {
          const data = resp.ventas_por_metodo_pago_hoy;

          this.pieChartOptions = {
            series2: data.map((item: any) =>
              Number(item.total_ventas)
            ),
            chart: {
              type: 'donut',
              width: 400,
            },
            labels: data.map((item: any) =>
              item.s_metodo_pago
            ),
            legend: {
              show: true,
              position: 'bottom',
            },
            dataLabels: {
              enabled: false,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 180,
                  },
                  legend: {
                    show: false,
                  },
                },
              },
            ],
          };
        }
      },
      error: (err: any) => {
        console.error('Error ventas por método de pago', err);
      }
    });
  }


  private cargarTopRefaccionistas(): void {
    const token = localStorage.getItem('token') || '';

    this.DashboardService.getTop5Refaccionistas().subscribe({
      next: (resp: any) => {
        console.log('RESPUESTA 👉', resp);

        if (
          resp &&
          resp.top_5_refaccionistas_ingresos &&
          resp.top_5_refaccionistas_ingresos.length > 0
        ) {
          this.topRefaccionistas = resp.top_5_refaccionistas_ingresos.map(
            (item: any) => ({
              id: item.id_usuario,
              nombre: item.refaccionista,
              totalVentas: item.total_ventas,
              montoTotal: Number(item.monto_total_vendido)
            })
          );
        } else {
          this.topRefaccionistas = [];
        }
      },
      error: (err: any) => {
        console.error('Error al cargar top refaccionistas', err);
        this.topRefaccionistas = [];
      }
    });
  }



  cargarTotalOrdenes(): void {

    const token = localStorage.getItem('token') || '';

    this.DashboardService.getVentasHoy().subscribe({
      next: (resp: any) => {
        this.totalOrdenes = resp.total_ventas_hoy;
      },
      error: (err: any) => {
        console.error('Error al obtener órdenes', err);
      }
    });
  }


  cargarOrdenesEnRepartoHoy(): void {

    const token = localStorage.getItem('token') || '';

    this.DashboardService.getOrdenesEnRepartoHoy().subscribe({
      next: (resp: any) => {
        console.log('REPARTOS HOY 🚚', resp);
        this.totalOrdenesReparto = resp.total_ordenes_reparto_hoy;
      },
      error: (err: any) => {
        console.error('Error al obtener repartos hoy ❌', err);
      }
    });
  }



  cargarOrdenesCompraHoy(): void {

    const token = localStorage.getItem('token') || '';

    this.DashboardService.getOrdenesCompraHoy().subscribe({
      next: (resp: any) => {
        console.log('ÓRDENES COMPRA HOY 🧾', resp);
        this.totalOrdenesCompraHoy = resp.total_ordenes_compra_hoy;
      },
      error: (err: any) => {
        console.error('ERROR ÓRDENES COMPRA HOY ❌', err);
      }
    });
  }


  cargarRequisicionesAprobadasHoy(): void {

    const token = localStorage.getItem('token') || '';

    this.DashboardService.getRequisicionesAprobadasHoy().subscribe({
      next: (resp: any) => {
        //console.log('REQUISICIONES APROBADAS HOY ✅', resp);
        this.totalRequisicionesAprobadasHoy = resp.total_requisiciones_aprobadas_hoy;
      },
      error: (err: any) => {
        console.error('ERROR REQUISICIONES HOY ', err);
      }
    });
  }



  cargarTopClientes(): void {
    const token = localStorage.getItem('token') || '';

    this.DashboardService.getTop5Clientes().subscribe({
      next: (resp: any[]) => {
        // Solo si resp es array
        if (Array.isArray(resp)) {
          this.topClientes = resp.map((item) => ({
            nombre: item.s_nombre_cliente,
            totalVentas: item.total_ventas,
            montoTotal: item.monto_total
          }));
        }
      },
      error: (err: any) => {
        console.error('Error al cargar top clientes', err);
      }
    });
  }




  TopRefaccionesCriticas(): void {
    const token = localStorage.getItem('token') || '';

    this.DashboardService.getRefaccionesCriticas().subscribe({
      next: (resp: any) => {
        // resp es un objeto, no un array
        const lista = resp?.top_5_refacciones_criticas;
        if (Array.isArray(lista)) {
          this.topRefaccionesCriticas = lista.map(item => ({
            id: item.id_refaccion,
            nombre: item.s_nombre_refaccion,
            categoria: item.s_categoria_refaccion,
            stockActual: item.n_stock_actual,
            stockMinimo: item.n_stock_minimo,
            stockMaximo: item.n_stock_maximo,
            tiempoReposicion: item.n_tiempo_reposicion
          }));
        } else {
          this.topRefaccionesCriticas = [];
        }
      },
      error: (err: any) => {
        console.error('Error al cargar top refacciones críticas', err);
        this.topRefaccionesCriticas = [];
      }
    });
  }







  cargarAcumuladoVentasHoy(): void {
    const token = localStorage.getItem('token') || '';

    this.DashboardService.getAcumuladoVentasHoy().subscribe({
      next: (resp: any) => {
        this.acumuladoVentasHoy = resp.acumulado_ventas_hoy;
      },
      error: (err: any) => {
        console.error('Error al cargar ventas acumuladas del día', err);
      }
    });
  }



  /* ----------- RELOJ ---------------- */
  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

  getHoraFormateada(): string {
    return this.fechaHoraActual.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  getFechaFormateada(): string {
    return this.fechaHoraActual.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }


  TopProveedoresActivosChart(): void {
    const token = localStorage.getItem('token') || '';

    this.DashboardService.getTopProveedores().subscribe({
      next: (resp: any) => {
        if (resp && resp.top_proveedores_refacciones) {
          const proveedores = resp.top_proveedores_refacciones.map((item: any) => item.proveedor);
          const refaccionesActivas = resp.top_proveedores_refacciones.map((item: any) => item.total_refacciones);

          this.topProveedoresChartOptions = {
            series: [
              {
                name: 'Refacciones Activas',
                data: refaccionesActivas
              }
            ],
            chart: {
              type: 'bar',
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: false,  // barras verticales
                columnWidth: '50%'  // ancho de la barra
              }
            },
            dataLabels: {
              enabled: true
            },
            xaxis: {
              categories: proveedores,
              title: {
                text: 'Proveedores'
              }
            },
            yaxis: {
              title: {
                text: 'Total Refacciones'
              }
            },
            colors: ['#FF4C4C'],  // rojo
            tooltip: {
              y: {
                formatter: (val: number) => val.toString()
              }
            }
          };
        }
      },
      error: (err: any) => console.error('Error al cargar top proveedores', err)
    });
  }





}




