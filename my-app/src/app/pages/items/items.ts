import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertDialog } from '../../components/alert-dialog/alert-dialog';
import { Api } from '../../services/api';

type ItemsTy = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

@Component({
  selector: 'app-items',
  imports: [ReactiveFormsModule, CommonModule, AlertDialog],
  templateUrl: './items.html',
  styleUrl: './items.css',
})
export class Items implements OnInit {
  itemForm: FormGroup;
  editingItemId: number | null = null;
  toastr = inject(ToastrService);
  api = inject(Api);

  showAlert = false;
  alertDialog = { title: '', message: '' };
  pendingDeleteId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  @ViewChild('itemModal') itemModal!: ElementRef<HTMLDialogElement>;

  items = signal<ItemsTy[]>([]);

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.api.getItems().subscribe({
      next: (data: any) => {
        console.log('Items loaded:', data);
        this.items.set(data?.results ?? []);
      },
      error: (error) => {
        console.error('Failed to load items:', error);
        this.toastr.error('Could not load items', 'Error');
      },
    });
  }

  editItem(itemId: number) {
    const item = this.items().find((i) => i.id === itemId);
    if (item) {
      this.itemForm.patchValue({
        name: item.name,
        quantity: item.quantity,
        description: item.description,
        price: item.price,
      });
      this.openModal();
      this.editingItemId = itemId;
    }
  }

  deleteItem(itemId: number) {
    const item = this.items().find((i) => i.id === itemId);
    if (!item) {
      return;
    }
    this.pendingDeleteId = itemId;
    this.alertDialog = {
      title: 'Delete Item',
      message: `Are you sure you want to delete "${item.name}"?`,
    };
    this.showAlert = true;
  }

  openModal() {
    this.itemModal.nativeElement.showModal();
  }

  closeModal() {
    this.itemForm.reset();
    this.itemModal.nativeElement.close();
    this.editingItemId = null;
  }

  addItem() {
    if (this.itemForm.valid) {
      const newItem = {
        name: this.itemForm.get('name')?.value,
        quantity: this.itemForm.get('quantity')?.value,
        description: this.itemForm.get('description')?.value,
        price: this.itemForm.get('price')?.value,
      };

      if (this.editingItemId) {
        this.api.updateItem(this.editingItemId, newItem).subscribe({
          next: (data: any) => {
            this.toastr.success('Item updated successfully', 'Success');
            this.closeModal();
            this.itemForm.reset();
            this.editingItemId = null;
          },
          error: (error) => {
            console.error('Failed to update item:', error);
            this.toastr.error('Could not update item', 'Error');
          },
          complete: () => {
            this.loadItems();
          },
        });
      } else {
        this.api.createItem(newItem).subscribe({
          next: () => {
            this.toastr.success('Item added successfully', 'Success');
            this.closeModal();
            this.itemForm.reset();
          },
          error: (error) => {
            console.error('Failed to add item:', error);
            this.toastr.error('Could not add item', 'Error');
          },
          complete: () => {
            this.loadItems();
          },
        });
      }

      this.closeModal();
      this.itemForm.reset();
      this.editingItemId = null;
    } else {
      console.log('Form is invalid');
      this.itemForm.markAllAsTouched();
    }
  }
  onCancel() {
    this.closeAlert();
  }

  onConfirmDelete() {
    const id = this.pendingDeleteId;
    if (id !== null) {
      this.api.deleteItem(id).subscribe({
        next: () => {
          this.items.set(this.items().filter((item) => item.id !== id));
          this.toastr.success('Item deleted successfully', 'Success');
        },
        complete: () => {
          this.loadItems();
        },
        error: (error) => {
          console.error('Failed to delete item:', error);
          this.toastr.error('Could not delete item', 'Error');
        },
      });
    }
    this.closeAlert();
  }

  private closeAlert() {
    this.showAlert = false;
    this.pendingDeleteId = null;
    this.alertDialog = { title: '', message: '' };
  }
}
