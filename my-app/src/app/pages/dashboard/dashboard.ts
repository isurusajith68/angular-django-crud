import { Component, inject, OnInit, signal } from '@angular/core';
import { Api, Stats } from '../../services/api';
import { StatsCard } from '../../components/stats-card/stats-card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [StatsCard],
})
export class Dashboard implements OnInit {
  links = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/users' },
  ];

  api = inject(Api);

  stats = signal<Stats>({ total_users: 0, total_items: 0 });

  ngOnInit() {
    this.api.getStats().subscribe({
      next: (stats) => {
        console.log('Statistics:', stats);
        this.stats.set(stats);
      },
      error: (error) => {
        console.error('Failed to load statistics:', error);
      },
    });
  }
}
