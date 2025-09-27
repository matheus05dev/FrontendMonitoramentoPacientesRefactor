import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeRequestDTO } from '../../../core/types/FuncionarioRequest';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';
import { Sexo } from '../../../core/enum/Sexo.enum';
import { Cargo } from '../../../core/enum/Cargo.enum';

@Component({
  selector: 'app-editar-funcionarios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-funcionarios.html',
  styleUrl: './editar-funcionarios.css',
})
export class EditarFuncionarios implements OnInit {
  form: FormGroup;
  id: number;
  sexos = Object.values(Sexo);
  cargos = Object.values(Cargo);

  constructor(
    private fb: FormBuilder,
    private funcionariosService: FuncionariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefones: this.fb.array([]),
      cargo: ['', Validators.required],
      especialidades: this.fb.array([]),
      identificacao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFuncionario();
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get especialidades(): FormArray {
    return this.form.get('especialidades') as FormArray;
  }

  loadFuncionario(): void {
    this.funcionariosService.buscarPorId(this.id).subscribe({
      next: (func) => {
        if (func) {
          this.form.patchValue({
            nome: func.nome,
            email: func.email,
            sexo: func.sexo,
            dataNascimento: func.dataNascimento,
            cpf: func.cpf,
            cargo: func.cargo,
            identificacao: func.identificacao,
          });
          // Clear existing arrays
          while (this.telefones.length) {
            this.telefones.removeAt(0);
          }
          while (this.especialidades.length) {
            this.especialidades.removeAt(0);
          }
          // Set telefones
          func.telefones.forEach((tel) => {
            this.telefones.push(
              this.fb.group({
                DDD: [tel.ddd ? tel.ddd.toString() : '', Validators.required],
                numero: [tel.numero || '', Validators.required],
              })
            );
          });
          // Set especialidades
          func.especialidades.forEach((esp) => {
            this.especialidades.push(this.fb.control(esp, Validators.required));
          });
        }
      },
      error: (err) => console.error('Erro ao carregar funcionário:', err),
    });
  }

  addTelefone(): void {
    this.telefones.push(
      this.fb.group({
        DDD: ['', Validators.required],
        numero: ['', Validators.required],
      })
    );
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  addEspecialidade(): void {
    this.especialidades.push(this.fb.control('', Validators.required));
  }

  removeEspecialidade(index: number): void {
    this.especialidades.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const funcionario: FuncionarioSaudeRequestDTO = {
        ...formValue,
        telefones: formValue.telefones.map((tel: any) => ({
          ddd: parseInt(tel.DDD, 10),
          numero: tel.numero,
        })),
      };
      this.funcionariosService.atualizar(this.id, funcionario).subscribe({
        next: () => this.router.navigate(['/funcionarios']),
        error: (err) => console.error('Erro ao atualizar funcionário:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/funcionarios']);
  }
}
