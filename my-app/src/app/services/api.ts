import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { SKIP_AUTH } from '../interceptors/auth-interceptor';
import { inject, Injectable } from '@angular/core';

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
}

export interface Stats {
  total_users: number;
  total_items: number;
}

export interface User {
  url: string;
  username: string;
  email: string;
  groups: string[];
}

export interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: number;
  name: string;
  images: string[];
  debut?: {
    manga?: string;
    anime?: string;
    novel?: string;
    movie?: string;
    game?: string;
    ova?: string;
    appearsIn?: string;
  };
  family?: {
    [key: string]: string;
  };
  jutsu?: string[];
  natureType?: string[];

  tools?: string[];
  uniqueTraits?: string[];
}

export interface CharacterListResponse {
  characters: Character[];
  currentPage: number;
  pageSize: number;
  total: number;
}

export type ItemPayload = Omit<Item, 'id' | 'created_at' | 'updated_at'>;

export type UserPayload = Omit<User, 'url'>;

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);

  private baseUrl = '';

  login(username: string, password: string) {
    const url = `${this.baseUrl}/auth/login/`;
    return this.http.post(url, { username, password });
  }

  logout() {
    const url = `${this.baseUrl}/auth/logout/`;
    return this.http.post(url, {});
  }

  getCurrentUser() {
    const url = `${this.baseUrl}/auth/me/`;
    return this.http.get<CurrentUser>(url);
  }

  getUsers() {
    const url = `${this.baseUrl}/users/`;
    return this.http.get<User>(url);
  }

  createUser(user: any) {
    const url = `${this.baseUrl}/auth/register/`;
    return this.http.post(url, user, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  updateUser(id: number, user: UserPayload) {
    const url = `${this.baseUrl}/users/${id}/`;
    return this.http.put<User>(url, user);
  }

  deleteUser(id: number) {
    const url = `${this.baseUrl}/users/${id}/`;
    return this.http.delete(url);
  }

  getItems() {
    const url = `${this.baseUrl}/api/items/`;
    return this.http.get<Item>(url);
  }

  createItem(item: ItemPayload) {
    const url = `${this.baseUrl}/api/items/`;
    return this.http.post<Item>(url, item);
  }

  updateItem(id: number, item: ItemPayload) {
    const url = `${this.baseUrl}/api/items/${id}/`;
    return this.http.put<Item>(url, item);
  }

  deleteItem(id: number) {
    const url = `${this.baseUrl}/api/items/${id}/`;
    return this.http.delete<void>(url);
  }

  getStats() {
    const url = `${this.baseUrl}/api/stats/`;
    return this.http.get<Stats>(url);
  }

  getCharacter(id: number) {
    const url = `${this.baseUrl}/api/characters/${id}/`;
    return this.http.get<Character>(url);
  }

  getCharacters(page = 1, limit = 10, name?: string) {
    const url = `${this.baseUrl}/api/characters/`;
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<CharacterListResponse>(url, { params });
  }
}
