import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-box2',
  imports: [CommonModule],
  templateUrl: './info-box2.component.html',
  styleUrl: './info-box2.component.scss',
})
export class InfoBox2Component {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() trendDirection: string = '';
  @Input() trendPercentage: string = '';
  @Input() trendText: string = '';
  @Input() colorClass: string = '';
}
