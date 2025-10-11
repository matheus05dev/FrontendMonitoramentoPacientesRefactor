import { Login } from './pages/login/login';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './core/guard/auth.guard-guard';
import { ToolbarSidenav } from './layout/toolbar-sidenav/toolbar-sidenav';
import { ListarFuncionarios } from './pages/funcionarios/listar-funcionarios/listar-funcionarios';
import { CriarFuncionarios } from './pages/funcionarios/criar-funcionarios/criar-funcionarios';
import { EditarFuncionarios } from './pages/funcionarios/editar-funcionarios/editar-funcionarios';
import { InfoFuncionarios } from './pages/funcionarios/info-funcionarios/info-funcionario';
import { ListarPacientes } from './pages/pacientes/listar-pacientes/listar-pacientes';
import { CriarPacientes } from './pages/pacientes/criar-pacientes/criar-pacientes';
import { EditarPacientes } from './pages/pacientes/editar-pacientes/editar-pacientes';
import { InfoPaciente } from './pages/pacientes/info-paciente/info-paciente';
import { ListarQuartos } from './pages/quartos/listar-quartos/listar-quartos';
import { CriarQuartos } from './pages/quartos/criar-quartos/criar-quartos';
import { EditarQuartos } from './pages/quartos/editar-quartos/editar-quartos';
import { InfoQuarto } from './pages/quartos/info-quarto/info-quarto';
import { ListarAtendimentos } from './pages/atendimentos/listar-atendimentos/listar-atendimentos';
import { CriarAtendimentos } from './pages/atendimentos/criar-atendimentos/criar-atendimentos';
import { EditarAtendimentos } from './pages/atendimentos/editar-atendimentos/editar-atendimentos';
import { InfoAtendimento } from './pages/atendimentos/info-atendimento/info-atendimento';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'app',
    component: ToolbarSidenav,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      {
        path: 'funcionarios',
        component: ListarFuncionarios,
      },
      {
        path: 'funcionarios/criar',
        component: CriarFuncionarios,
      },
      {
        path: 'funcionarios/editar/:id',
        component: EditarFuncionarios,
      },
      {
        path: 'funcionarios/info/:id',
        component: InfoFuncionarios,
      },
      {
        path: 'pacientes',
        component: ListarPacientes,
      },
      {
        path: 'pacientes/criar',
        component: CriarPacientes,
      },
      {
        path: 'pacientes/editar/:id',
        component: EditarPacientes,
      },
      {
        path: 'pacientes/info/:id',
        component: InfoPaciente,
      },
      {
        path: 'quartos',
        component: ListarQuartos,
      },
      {
        path: 'quartos/criar',
        component: CriarQuartos,
      },
      {
        path: 'quartos/editar/:id',
        component: EditarQuartos,
      },
      {
        path: 'quartos/info/:id',
        component: InfoQuarto,
      },
      {
        path: 'atendimentos',
        component: ListarAtendimentos,
      },
      {
        path: 'atendimentos/criar',
        component: CriarAtendimentos,
      },
      {
        path: 'atendimentos/editar/:id',
        component: EditarAtendimentos,
      },
      {
        path: 'atendimentos/info/:id',
        component: InfoAtendimento,
      },
    ],
  },
];
