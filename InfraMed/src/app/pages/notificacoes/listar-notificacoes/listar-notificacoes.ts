import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotificacoesService } from '../../../core/services/notificacoes.service';
import { NotificacaoResponse } from '../../../core/types/NotificacaoResponse';

@Component({
  selector: 'app-listar-notificacoes',
  imports: [CommonModule, FormsModule, MatIconModule],
  standalone: true,
  templateUrl: './listar-notificacoes.html',
  styleUrl: './listar-notificacoes.css'
})
export class ListarNotificacoes implements OnInit {
  notificacoes: NotificacaoResponse[] = [];
  filteredNotificacoes: NotificacaoResponse[] = [];
  searchTerm: string = '';
  loading = false;
  error: string | null = null;

  constructor(private notificacoesService: NotificacoesService) {}

  ngOnInit(): void {
    this.carregarNotificacoes();
  }

  carregarNotificacoes(): void {
    this.loading = true;
    this.error = null;

    this.notificacoesService.buscarHistoricoNotificacoes().subscribe({
      next: (data) => {
        this.notificacoes = data;
        this.filteredNotificacoes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar notificações';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredNotificacoes = this.notificacoes.filter(
        (notificacao) =>
          notificacao.numeroQuarto?.toString().includes(term) ||
          notificacao.leituraSensor?.tipoDado?.toLowerCase().includes(term) ||
          notificacao.status?.toLowerCase().includes(term)
      );
    } else {
      this.filteredNotificacoes = this.notificacoes;
    }
  }
}
