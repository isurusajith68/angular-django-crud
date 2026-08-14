import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api, CurrentUser } from '../../services/api';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private api = inject(Api);

  currentUser = signal<CurrentUser | null>(null);

  constructor(private router: Router) {}
  links = [
    { label: 'Dashboard', href: '/dashboard' },
    // { label: 'Users', href: '/users' },
    { label: 'Items', href: '/items' },
  ];

  ngOnInit() {
    this.api.getCurrentUser().subscribe({
      next: (user) => this.currentUser.set(user),
      error: (error) => {
        console.error('Failed to load current user:', error);
        this.currentUser.set(null);
      },
    });
  }

  logout() {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
