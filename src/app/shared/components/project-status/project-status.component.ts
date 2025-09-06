import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface Project {
  name: string;
  progress: number;
  progressColor: string;
}

@Component({
  selector: 'app-project-status',
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './project-status.component.html',
  styleUrl: './project-status.component.scss',
})
export class ProjectStatusComponent {
  @Input() projects: Project[] = [];
}
