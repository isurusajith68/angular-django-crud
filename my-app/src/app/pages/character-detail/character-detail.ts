import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api, Character } from '../../services/api';

@Component({
  selector: 'app-character-detail',
  imports: [RouterLink],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
})
export class CharacterDetail implements OnInit {
  api = inject(Api);
  route = inject(ActivatedRoute);

  character = signal<Character | null>(null);
  isLoading = signal(true);
  error = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid character id.');
      this.isLoading.set(false);
      return;
    }

    this.api.getCharacter(id).subscribe({
      next: (character) => {
        this.character.set(character);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load character:', err);
        this.error.set(err.status === 404 ? 'Character not found.' : 'Could not load character.');
        this.isLoading.set(false);
      },
    });
  }
}
