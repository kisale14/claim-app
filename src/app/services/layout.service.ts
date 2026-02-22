import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly STORAGE_KEY = 'sidebar_collapsed';
  private _menuCollapsed = signal<boolean>(this.loadInitialState());
  public menuCollapsed = this._menuCollapsed.asReadonly();

  private loadInitialState(): boolean {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch (error) {
      console.error('Error loading sidebar state:', error);
      return false;
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._menuCollapsed()));
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }

  toggleMenu(): void {
    this._menuCollapsed.update((state) => !state);
    this.saveState(); // Guardado explícito
  }

  setMenuCollapsed(state: boolean): void {
    this._menuCollapsed.set(state);
    this.saveState(); // Guardado explícito
  }

  resetMenuCollapsed(): void {
    this.setMenuCollapsed(false);
  }

  clearSavedState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.setMenuCollapsed(false);
  }

  reloadFromStorage(): void {
    const savedState = this.loadInitialState();
    if (savedState !== this._menuCollapsed()) {
      this._menuCollapsed.set(savedState);
    }
  }
}
