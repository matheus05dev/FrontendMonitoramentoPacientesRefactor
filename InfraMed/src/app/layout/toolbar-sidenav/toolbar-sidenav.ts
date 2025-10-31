import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-toolbar-sidenav',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './toolbar-sidenav.html',
  styleUrl: './toolbar-sidenav.css',
})
export class ToolbarSidenav implements OnInit, OnDestroy {
  isOpen = false;

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.close();
    }
  };

  toggle() { this.isOpen = !this.isOpen; }
  open() { this.isOpen = true; }
  close() { this.isOpen = false; }

  ngOnInit(): void {
    document.addEventListener('keydown', this._onKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this._onKeydown);
  }
}
