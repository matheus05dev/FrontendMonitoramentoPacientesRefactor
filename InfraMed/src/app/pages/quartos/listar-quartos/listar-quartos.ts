import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuartosService } from '../../../core/services/quartos.service';
import { QuartoResponse } from '../../../core/types/QuartoResponse';

@Component({
  selector: 'app-listar-quartos',
  imports: [CommonModule],
  templateUrl: './listar-quartos.html',
  styleUrl: './listar-quartos.css',
})
export class ListarQuartos implements OnInit {
  quartos: QuartoResponse[] = [];
  loading = false;

  constructor(private quartosService: QuartosService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuartos();
  }

  loadQuartos(): void {
    this.loading = true;
    this.quartosService.listarTodos().subscribe({
      next: (data) => {
        this.quartos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar quartos:', err);
        this.loading = false;
      },
    });
  }

  viewQuarto(id: number): void {
    this.router.navigate(['app/quartos/info', id]);
  }

  editQuarto(id: number): void {
    this.router.navigate(['app/quartos/editar', id]);
  }

  deleteQuarto(id: number): void {
    if (confirm('Tem certeza que deseja deletar este quarto?')) {
      this.quartosService.deletar(id).subscribe({
        next: () => {
          this.loadQuartos();
        },
        error: (err) => {
          console.error('Erro ao deletar quarto:', err);
        },
      });
    }
  }

  createQuarto(): void {
    this.router.navigate(['app/quartos/criar']);
  }
}
