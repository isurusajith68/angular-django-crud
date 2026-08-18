import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api, Character, CharacterListResponse } from '../../services/api';

@Component({
  selector: 'app-characters',
  imports: [RouterLink],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters implements OnInit {
  api = inject(Api);
  isLoading = signal(true);
  error = signal('');

  characters: Character[] = [];

  ngOnInit() {
    this.api.getCharacters().subscribe({
      next: (data: CharacterListResponse) => {
        this.characters = data.characters ?? [];
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load characters:', err);
        this.error.set('Could not load characters.');
        this.isLoading.set(false);
      },
    });
  }
}
