import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';

@Component({
  selector: 'app-listar-funcionarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-funcionarios.html',
  styleUrl: './listar-funcionarios.css',
})
export class ListarFuncionarios implements OnInit {
  funcionarios: FuncionarioSaudeResponseDTO[] = [];
  filteredFuncionarios: FuncionarioSaudeResponseDTO[] = [];
  searchTerm: string = '';

  constructor(
    private funcionariosService: FuncionariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.funcionariosService.listarTodos().subscribe({
      next: (data) => {
        this.funcionarios = data;
        this.filteredFuncionarios = data;
      },
      error: (err) => console.error('Erro ao carregar funcionários:', err),
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.funcionariosService.buscarPorNome(this.searchTerm).subscribe({
        next: (data) => (this.filteredFuncionarios = data),
        error: (err) => console.error('Erro na busca:', err),
      });
    } else {
      this.filteredFuncionarios = this.funcionarios;
    }
  }

  viewFuncionario(id: number): void {
    this.router.navigate(['app/funcionarios/info', id]);
  }

  editFuncionario(id: number): void {
    this.router.navigate(['app/funcionarios/editar', id]);
  }

  deleteFuncionario(id: number): void {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.funcionariosService.deletar(id).subscribe({
        next: () => this.loadFuncionarios(),
        error: (err) => console.error('Erro ao deletar:', err),
      });
    }
  }

  createFuncionario(): void {
    this.router.navigate(['/app/funcionarios/criar']);
  }
}
