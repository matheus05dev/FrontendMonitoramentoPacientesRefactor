import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';

@Component({
  selector: 'app-info-funcionario',
  imports: [CommonModule],
  templateUrl: './info-funcionario.html',
  styleUrl: './info-funcionario.css',
})
export class InfoFuncionarios implements OnInit {
  funcionario: FuncionarioSaudeResponseDTO | null = null;
  id: number;

  constructor(
    private funcionariosService: FuncionariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadFuncionario();
  }

  loadFuncionario(): void {
    this.funcionariosService.buscarPorId(this.id).subscribe({
      next: (func) => (this.funcionario = func),
      error: (err) => console.error('Erro ao carregar funcionário:', err),
    });
  }

  edit(): void {
    this.router.navigate(['/funcionarios/editar', this.id]);
  }

  back(): void {
    this.router.navigate(['/funcionarios']);
  }
}
