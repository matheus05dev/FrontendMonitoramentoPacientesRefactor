import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AtendimentosService } from '../../../core/services/atendimentos.service';
import { AtendimentoResponse } from '../../../core/types/AtendimentoResponse';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listar-atendimentos',
  imports: [CommonModule, MatIconModule
  ],
  standalone: true,
  templateUrl: './listar-atendimentos.html',
  styleUrl: './listar-atendimentos.css',
})
export class ListarAtendimentos implements OnInit {
  atendimentos: AtendimentoResponse[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private atendimentosService: AtendimentosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAtendimentos();
  }

  carregarAtendimentos(): void {
    this.atendimentosService.listarTodos().subscribe({
      next: (data) => {
        this.atendimentos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar atendimentos';
        this.loading = false;
        console.error(err);
      },
    });
  }

  navegarParaCriar(): void {
    this.router.navigate(['app/atendimentos/criar']);
  }

  navegarParaInfo(id: number): void {
    this.router.navigate(['app/atendimentos/info', id]);
  }

  navegarParaEditar(id: number): void {
    this.router.navigate(['app/atendimentos/editar', id]);
  }

  deletarAtendimento(id: number): void {
    if (confirm('Tem certeza que deseja deletar este atendimento?')) {
      this.atendimentosService.deletar(id).subscribe({
        next: () => {
          this.carregarAtendimentos();
          alert('Atendimento deletado com sucesso!');
        },
        error: (err) => {
          alert('Erro ao deletar atendimento');
          console.error(err);
        },
      });
    }
  }
}
