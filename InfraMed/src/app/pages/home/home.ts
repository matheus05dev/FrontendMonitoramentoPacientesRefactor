import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { NotificacoesService } from '../../core/services/notificacoes.service';
import { NotificacaoResponse } from '../../core/types/NotificacaoResponse';
import { StatusNotificacao } from '../../core/enum/StatusNotificacao.enum';
import { TipoDado } from '../../core/enum/TipoDado.enum';
import { Gravidade } from '../../core/enum/Gravidade.enum';
import { Subscription } from 'rxjs';

interface ActivityDisplay {
  type: string;
  name: string;
  action: string;
  time: string;
  icon: string;
  gravidade?: Gravidade;
  status?: StatusNotificacao;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  private notificacoesService = inject(NotificacoesService);
  private notificacoesSubscription?: Subscription;

  mockRooms = Array(6).fill(0);
  activities: ActivityDisplay[] = [];
  isLoadingNotificacoes = false;
  isDarkMode = false;

  ngOnInit(): void {
    // Check system preference on component init
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    // Carregar notificações via WebSocket
    this.carregarNotificacoes();
  }

  ngOnDestroy(): void {
    // Limpar subscription ao destruir o componente
    if (this.notificacoesSubscription) {
      this.notificacoesSubscription.unsubscribe();
    }
  }

  carregarNotificacoes(): void {
    this.isLoadingNotificacoes = true;
    console.log('Iniciando carregamento de notificações...');
    
    // Aguardar um pouco para garantir que o WebSocket esteja conectado
    // O WebSocket já deve estar conectado após o login, mas aguardamos para garantir
    setTimeout(() => {
      console.log('Buscando histórico de notificações via WebSocket...');
      this.notificacoesSubscription = this.notificacoesService
        .buscarHistoricoNotificacoes()
        .subscribe({
          next: (notificacoes: NotificacaoResponse[]) => {
            console.log('Notificações recebidas no componente:', notificacoes);
            if (notificacoes && Array.isArray(notificacoes) && notificacoes.length > 0) {
              console.log(`Transformando ${notificacoes.length} notificações em atividades...`);
              this.activities = this.transformarNotificacoesEmAtividades(notificacoes);
              console.log(`Atividades criadas: ${this.activities.length}`);
            } else {
              console.log('Nenhuma notificação recebida ou array vazio');
              this.activities = [];
            }
            this.isLoadingNotificacoes = false;
          },
          error: (error) => {
            console.error('Erro ao carregar notificações via WebSocket:', error);
            console.warn('Notificações não serão carregadas. Verifique se o WebSocket está configurado corretamente no backend.');
            this.isLoadingNotificacoes = false;
            this.activities = [];
          }
        });
    }, 500); // Reduzido para 500ms, já que o WebSocket deve estar conectado após o login
  }

  transformarNotificacoesEmAtividades(notificacoes: NotificacaoResponse[]): ActivityDisplay[] {
    return notificacoes
      .sort((a, b) => {
        // Ordenar por data de criação (mais recentes primeiro)
        const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
        const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
        return dataB - dataA;
      })
      .map(notificacao => {
        const leitura = notificacao.leituraSensor;
        const tipoDado = leitura?.tipoDado || '';
        const valor = leitura?.valor || 0;
        const unidadeMedida = leitura?.unidadeMedida || '';
        const gravidade = leitura?.gravidade;
        const numeroQuarto = notificacao.numeroQuarto || 0;

        // Determinar ícone e tipo baseado no tipo de dado
        let icon = 'warning';
        let type = 'alert';
        
        if (tipoDado === TipoDado.TEMPERATURA) {
          icon = 'thermostat';
          type = 'temperature';
        } else if (tipoDado === TipoDado.FREQUENCIA_CARDIACA) {
          icon = 'favorite';
          type = 'heart';
        } else if (tipoDado === TipoDado.PRESSAO_ARTERIAL) {
          icon = 'monitor_heart';
          type = 'pressure';
        }

        // Criar descrição da ação
        let action = '';
        if (tipoDado && valor) {
          action = `${this.formatarTipoDado(tipoDado)}: ${valor} ${unidadeMedida}`;
          if (gravidade) {
            action += ` (${this.formatarGravidade(gravidade)})`;
          }
        } else {
          action = 'Leitura de sensor';
        }

        // Nome baseado no quarto
        const name = numeroQuarto > 0 ? `Quarto ${numeroQuarto}` : 'Monitoramento';

        // Formatar tempo
        const time = this.formatarTempo(notificacao.dataCriacao);

        return {
          type,
          name,
          action,
          time,
          icon,
          gravidade,
          status: notificacao.status,
        };
      });
  }

  formatarTipoDado(tipoDado: string): string {
    const map: { [key: string]: string } = {
      [TipoDado.TEMPERATURA]: 'Temperatura',
      [TipoDado.FREQUENCIA_CARDIACA]: 'Frequência Cardíaca',
      [TipoDado.PRESSAO_ARTERIAL]: 'Pressão Arterial',
    };
    return map[tipoDado] || tipoDado;
  }

  formatarGravidade(gravidade: Gravidade): string {
    const map: { [key: string]: string } = {
      [Gravidade.EMERGENCIAL]: 'Emergencial',
      [Gravidade.ALERTA]: 'Alerta',
      [Gravidade.NORMAL]: 'Normal',
    };
    return map[gravidade] || gravidade;
  }

  formatarTempo(data: string | undefined): string {
    if (!data) {
      return 'Data não disponível';
    }

    try {
      const dataNotificacao = new Date(data);
      const agora = new Date();
      const diferencaMs = agora.getTime() - dataNotificacao.getTime();
      const diferencaMinutos = Math.floor(diferencaMs / 60000);
      const diferencaHoras = Math.floor(diferencaMinutos / 60);
      const diferencaDias = Math.floor(diferencaHoras / 24);

      if (diferencaMinutos < 1) {
        return 'Agora';
      } else if (diferencaMinutos < 60) {
        return `${diferencaMinutos} minuto${diferencaMinutos > 1 ? 's' : ''} atrás`;
      } else if (diferencaHoras < 24) {
        return `${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''} atrás`;
      } else if (diferencaDias < 7) {
        return `${diferencaDias} dia${diferencaDias > 1 ? 's' : ''} atrás`;
      } else {
        // Formato de data completo para datas mais antigas
        return dataNotificacao.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch (error) {
      return 'Data inválida';
    }
  }

  getStatusClass(status: StatusNotificacao | undefined): string {
    if (!status) return '';
    
    const map: { [key: string]: string } = {
      [StatusNotificacao.ABERTA]: 'status-aberta',
      [StatusNotificacao.EM_ATENDIMENTO]: 'status-em-atendimento',
      [StatusNotificacao.FECHADA]: 'status-fechada',
    };
    return map[status] || '';
  }

  getGravidadeClass(gravidade: Gravidade | undefined): string {
    if (!gravidade) return '';
    
    const map: { [key: string]: string } = {
      [Gravidade.EMERGENCIAL]: 'gravidade-emergencial',
      [Gravidade.ALERTA]: 'gravidade-alerta',
      [Gravidade.NORMAL]: 'gravidade-normal',
    };
    return map[gravidade] || '';
  }

  formatarStatus(status: StatusNotificacao): string {
    const map: { [key: string]: string } = {
      [StatusNotificacao.ABERTA]: 'Aberta',
      [StatusNotificacao.EM_ATENDIMENTO]: 'Em Atendimento',
      [StatusNotificacao.FECHADA]: 'Fechada',
    };
    return map[status] || status;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }
}
