import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AtendimentosService } from '../../../core/services/atendimentos.service';
import { AtendimentoResponse } from '../../../core/types/AtendimentoResponse';

@Component({
  selector: 'app-info-atendimento',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './info-atendimento.html',
  styleUrl: './info-atendimento.css',
})
export class InfoAtendimento implements OnInit {
  atendimento: AtendimentoResponse | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private atendimentosService: AtendimentosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregarAtendimento(id);
    } else {
      this.error = 'ID de atendimento inválido';
      this.loading = false;
    }
  }

  carregarAtendimento(id: number): void {
    this.atendimentosService.buscarPorId(id).subscribe({
      next: (data) => {
        this.atendimento = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar atendimento';
        this.loading = false;
        console.error(err);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/atendimentos']);
  }
}
