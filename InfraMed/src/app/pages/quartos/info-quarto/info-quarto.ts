import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuartosService } from '../../../core/services/quartos';
import { PacientesService } from '../../../core/services/pacientes';
import { QuartoResponse } from '../../../core/types/QuartoResponse';
import { PacienteResponse } from '../../../core/types/PacienteResponse';

@Component({
  selector: 'app-info-quarto',
  imports: [CommonModule, FormsModule],
  templateUrl: './info-quarto.html',
  styleUrl: './info-quarto.css',
})
export class InfoQuarto implements OnInit {
  quarto: QuartoResponse | null = null;
  id: number;
  patients: PacienteResponse[] = [];
  availablePatients: PacienteResponse[] = [];
  allocatedPatients: PacienteResponse[] = [];
  selectedAllocate: PacienteResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quartosService: QuartosService,
    private pacientesService: PacientesService
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadQuarto();
    this.loadPacientes();
  }

  loadQuarto(): void {
    this.quartosService.buscarPorId(this.id).subscribe({
      next: (data) => {
        this.quarto = data;
        this.updatePatientLists();
      },
      error: (err) => {
        console.error('Erro ao carregar quarto:', err);
        this.router.navigate(['/quartos']);
      },
    });
  }

  loadPacientes(): void {
    this.pacientesService.listarTodos().subscribe({
      next: (data) => {
        this.patients = data;
        this.updatePatientLists();
      },
      error: (err) => {
        console.error('Erro ao carregar pacientes:', err);
      },
    });
  }

  updatePatientLists(): void {
    if (this.quarto && this.patients.length > 0) {
      this.availablePatients = this.patients.filter(
        (p) => !this.quarto!.pacientesIds.includes(p.id)
      );
      this.allocatedPatients = this.patients.filter((p) =>
        this.quarto!.pacientesIds.includes(p.id)
      );
    }
  }

  getPatientName(id: number): string {
    const patient = this.patients.find((p) => p.id === id);
    return patient ? patient.nome : 'Paciente desconhecido';
  }

  allocatePaciente(): void {
    if (this.selectedAllocate) {
      this.quartosService
        .alocarPaciente(this.id, this.selectedAllocate.id)
        .subscribe({
          next: (updatedQuarto) => {
            this.quarto = updatedQuarto;
            this.selectedAllocate = null;
            this.updatePatientLists();
            alert('Paciente alocado com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao alocar paciente:', err);
            alert('Erro ao alocar paciente.');
          },
        });
    }
  }

  removePaciente(id: number): void {
    this.quartosService.removerPaciente(this.id, id).subscribe({
      next: (updatedQuarto) => {
        this.quarto = updatedQuarto;
        this.updatePatientLists();
        alert('Paciente removido com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao remover paciente:', err);
        alert('Erro ao remover paciente.');
      },
    });
  }

  edit(): void {
    this.router.navigate(['/quartos/editar', this.id]);
  }

  back(): void {
    this.router.navigate(['/quartos']);
  }
}
