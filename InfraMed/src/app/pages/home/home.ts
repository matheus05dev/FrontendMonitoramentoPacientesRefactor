import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  // Mock data for demonstration
  mockRooms = Array(6).fill(0);
  mockActivities = [
    { type: 'patient', name: 'João Silva', action: 'Admitted', time: '2 hours ago' },
    { type: 'doctor', name: 'Dr. Maria Santos', action: 'Started shift', time: '3 hours ago' },
    { type: 'appointment', name: 'Consultation', action: 'Completed', time: '4 hours ago' },
  ];

  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }

  constructor() {
    // Check system preference on component init
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
  }
}
