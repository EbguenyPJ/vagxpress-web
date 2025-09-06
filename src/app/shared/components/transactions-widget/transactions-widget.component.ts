import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Transaction {
  type: string;
  category: string;
  description: string;
  amount: number;
  icon: string;
  iconColor: string;
  textColor: string;
}

@Component({
  selector: 'app-transactions-widget',
  imports: [CommonModule],
  templateUrl: './transactions-widget.component.html',
  styleUrl: './transactions-widget.component.scss',
})
export class TransactionsWidgetComponent {
  @Input() transactions: Transaction[] = [];
}
