import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // Usamos un signal para el estado del menú (colapsado o no)
  private _menuCollapsed = signal(false);

  // Exponemos una señal de solo lectura para los componentes
  public menuCollapsed = this._menuCollapsed.asReadonly();

  /**
   * Método para alternar el estado del menú.
   * Es el equivalente a onMenuToggle() en la documentación de Sakai.
   */
  toggleMenu() {
    this._menuCollapsed.update((state) => !state);
  }

  /**
   * Método para establecer un estado específico (útil para ciertas rutas o responsive).
   */
  setMenuCollapsed(state: boolean) {
    this._menuCollapsed.set(state);
  }
}
