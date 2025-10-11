import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { QuartosService } from '../../../core/services/quartos.service';
import { QuartoRequest } from '../../../core/types/QuartoRequest';
import { LocalizacaoQuarto } from '../../../core/enum/LocalizacaoQuarto.enum';
import { TipoQuarto } from '../../../core/enum/TipoQuarto.enum';

@Component({
  selector: 'app-criar-quartos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-quartos.html',
  styleUrl: './criar-quartos.css',
})
export class CriarQuartos {
  form: FormGroup;
  localizacoes = Object.values(LocalizacaoQuarto);
  tipos = Object.values(TipoQuarto);

  constructor(
    private fb: FormBuilder,
    private quartosService: QuartosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1)]],
      localizacao: ['', Validators.required],
      tipo: ['', Validators.required],
      capacidade: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const request: QuartoRequest = this.form.value;
      this.quartosService.criar(request).subscribe({
        next: () => this.router.navigate(['app/quartos']),
        error: (err) => console.error('Erro ao criar quarto:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['app/quartos']);
  }
}
