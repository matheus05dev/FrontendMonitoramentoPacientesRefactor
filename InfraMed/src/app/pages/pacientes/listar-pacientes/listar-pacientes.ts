import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacientesService } from '../../../core/services/pacientes.service';
import { PacienteResponse } from '../../../core/types/PacienteResponse';

@Component({
  selector: 'app-listar-pacientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-pacientes.html',
  styleUrl: './listar-pacientes.css',
})
export class ListarPacientes implements OnInit {
  pacientes: PacienteResponse[] = [];
  searchNome: string = '';
  loading = false;

  constructor(
    private pacientesService: PacientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loading = true;
    this.pacientesService.listarTodos().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pacientes:', err);
        this.loading = false;
      },
    });
  }

  searchByNome(): void {
    if (this.searchNome.trim()) {
      this.loading = true;
      this.pacientesService.buscarPorNome(this.searchNome).subscribe({
        next: (data) => {
          this.pacientes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar pacientes:', err);
          this.loading = false;
        },
      });
    } else {
      this.loadPacientes();
    }
  }

  viewPaciente(id: number): void {
    this.router.navigate(['app/pacientes/info', id]);
  }

  editPaciente(id: number): void {
    this.router.navigate(['app/pacientes/editar', id]);
  }

  deletePaciente(id: number): void {
    if (confirm('Tem certeza que deseja deletar este paciente?')) {
      this.pacientesService.deletar(id).subscribe({
        next: () => {
          this.loadPacientes();
        },
        error: (err) => {
          console.error('Erro ao deletar paciente:', err);
        },
      });
    }
  }

  createPaciente(): void {
    this.router.navigate(['app/pacientes/criar']);
  }
}
