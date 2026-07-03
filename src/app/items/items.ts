import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../core/api.service';
import { Item } from '../core/models';

/**
 * CRUD mínimo sobre /api/items: listar, crear, editar en línea y borrar.
 * Estado local con signals; sin librería de estado hasta que el
 * proyecto lo justifique (decisión documentada en la skill vektor-1.0).
 */
@Component({
  selector: 'app-items',
  imports: [FormsModule],
  templateUrl: './items.html',
  styleUrl: './items.scss',
})
export class Items implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly items = signal<Item[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly editingId = signal<number | null>(null);

  protected newName = '';
  protected newDescription = '';
  protected editName = '';
  protected editDescription = '';

  ngOnInit(): void {
    this.reload();
  }

  protected reload(): void {
    this.api.listItems().subscribe({
      next: (items) => this.items.set(items),
      error: () => this.error.set('No se pudo conectar con el backend.'),
    });
  }

  protected create(): void {
    const name = this.newName.trim();
    if (!name) {
      return;
    }
    this.api
      .createItem({ name, description: this.newDescription.trim() || null })
      .subscribe({
        next: () => {
          this.newName = '';
          this.newDescription = '';
          this.reload();
        },
        error: () => this.error.set('Error al crear el item.'),
      });
  }

  protected startEdit(item: Item): void {
    this.editingId.set(item.id);
    this.editName = item.name;
    this.editDescription = item.description ?? '';
  }

  protected saveEdit(id: number): void {
    const name = this.editName.trim();
    if (!name) {
      return;
    }
    this.api
      .updateItem(id, { name, description: this.editDescription.trim() || null })
      .subscribe({
        next: () => {
          this.editingId.set(null);
          this.reload();
        },
        error: () => this.error.set('Error al actualizar el item.'),
      });
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected remove(id: number): void {
    this.api.deleteItem(id).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Error al borrar el item.'),
    });
  }
}
