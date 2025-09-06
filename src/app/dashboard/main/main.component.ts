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
import { NewOrderListComponent } from '@shared/components/new-order-list/new-order-list.component';
import { DocumentListComponent } from '@shared/components/document-list/document-list.component';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';
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
  ],
})
export class MainComponent {
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

  constructor() {
    this.chart1();
    this.chart2();
    this.smallChart();
    this.smallChart2();
  }
  private chart1() {
    let ts2 = 1484418600000;
    const dates = [];
    for (let i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      dates.push([ts2, dataSeries[1][i].value]);
    }
    this.areaChartOptions = {
      series: [
        {
          name: 'Booking Per Day',
          data: dates,
        },
      ],
      chart: {
        type: 'area',
        stacked: false,
        height: 250,
        toolbar: {
          show: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#9F8DF1', '#E79A3B'],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: 'Booking',
        },
      },
      xaxis: {
        type: 'datetime',
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
      },
    };
  }
  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58],
        },
        {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#5C9FFB', '#AEAEAE'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          },
        },
      },
    };
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
    this.pieChartOptions = {
      series2: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Science', 'Mathes', 'Economics', 'History', 'Music'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };
  }

  // document list

  documentList = [
    {
      title: 'Java Programming',
      type: '.doc',
      size: 4.3,
      icon: 'far fa-file-word',
      iconClass: 'primary-rgba text-primary',
      textClass: '',
    },
    {
      title: 'Angular Theory',
      type: '.xls',
      size: 2.5,
      icon: 'far fa-file-excel',
      iconClass: 'success-rgba text-success',
      textClass: '',
    },
    {
      title: 'Maths Sums Solution',
      type: '.pdf',
      size: 10.5,
      icon: 'far fa-file-pdf',
      iconClass: 'danger-rgba text-danger',
      textClass: '',
    },
    {
      title: 'Submit Science Journal',
      type: '.zip',
      size: 53.2,
      icon: 'far fa-file-archive',
      iconClass: 'info-rgba text-info',
      textClass: '',
    },
    {
      title: 'Marketing Instructions',
      type: '.doc',
      size: 5.3,
      icon: 'far fa-file-word',
      iconClass: 'primary-rgba text-primary',
      textClass: '',
    },
  ];

  // recent order data

  orderData = [
    {
      id: 'ID7865',
      name: 'Jens Brincker',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'iPhone X',
      orderDate: '05/22/2021',
      quantity: 2,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user1.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID9357',
      name: 'Mark Harry',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Pixel 2',
      orderDate: '06/12/2021',
      quantity: 1,
      paymentMethod: 'COD',
      status: 'Unpaid',
      invoice: 'download link',
      img: 'assets/images/user/user2.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID3987',
      name: 'Anthony Davie',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'OnePlus',
      orderDate: '02/02/2021',
      quantity: 5,
      paymentMethod: 'Debit Card',
      status: 'Pending',
      invoice: 'download link',
      img: 'assets/images/user/user3.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID2483',
      name: 'David Perry',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Moto Z2',
      orderDate: '01/10/2021',
      quantity: 2,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user4.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID2986',
      name: 'John Doe',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Samsung F62',
      orderDate: '05/20/2021',
      quantity: 3,
      paymentMethod: 'Net Banking',
      status: 'Unpaid',
      invoice: 'download link',
      img: 'assets/images/user/user5.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID1267',
      name: 'Sarah Smith',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'iPhone 12',
      orderDate: '07/10/2021',
      quantity: 1,
      paymentMethod: 'COD',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user6.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID3398',
      name: 'Cara Stevens',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Moto Gs5',
      orderDate: '04/11/2021',
      quantity: 2,
      paymentMethod: 'UPI Payment',
      status: 'Pending',
      invoice: 'download link',
      img: 'assets/images/user/user7.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID9965',
      name: 'Ashton Cox',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Pixel 2',
      orderDate: '05/14/2021',
      quantity: 4,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user8.jpg',
      detailsButton: 'Details',
    },
  ];

  orderColumnDefinitions = [
    { def: 'id', label: 'Order ID', type: 'text' },
    { def: 'name', label: 'Customer Name', type: 'text' },
    { def: 'item', label: 'Item', type: 'text' },
    { def: 'orderDate', label: 'Order Date', type: 'date' },
    { def: 'quantity', label: 'Quantity', type: 'number' },
    { def: 'paymentMethod', label: 'Payment', type: 'text' },
    { def: 'status', label: 'Status', type: 'text' },
    { def: 'invoice', label: 'Invoice', type: 'file' },
    { def: 'detailsButton', label: 'Details', type: 'button' },
  ];
}
