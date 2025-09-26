import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PacientesService } from '../../../core/services/pacientes';
import { PacienteRequest } from '../../../core/types/PacienteRequest';
import { Sexo } from '../../../core/enum/Sexo.enum';

@Component({
  selector: 'app-criar-pacientes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-pacientes.html',
  styleUrl: './criar-pacientes.css',
})
export class CriarPacientes {
  form: FormGroup;
  sexos = Object.values(Sexo);

  constructor(
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefones: this.fb.array([]),
      alergias: this.fb.array([]),
    });
    // Add initial telefone
    this.addTelefone();
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get alergias(): FormArray {
    return this.form.get('alergias') as FormArray;
  }

  addTelefone(): void {
    this.telefones.push(
      this.fb.group({
        ddd: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      })
    );
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  addAlergia(): void {
    this.alergias.push(this.fb.control('', Validators.required));
  }

  removeAlergia(index: number): void {
    this.alergias.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const paciente: PacienteRequest = {
        ...formValue,
        dataNascimento: formValue.dataNascimento,
        quartoId: parseInt(formValue.quartoId, 10),
        telefones: formValue.telefones.map((tel: any) => ({
          ddd: parseInt(tel.ddd, 10),
          numero: tel.numero,
        })),
      };
      this.pacientesService.criar(paciente).subscribe({
        next: () => this.router.navigate(['/pacientes']),
        error: (err) => console.error('Erro ao criar paciente:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/pacientes']);
  }
}
