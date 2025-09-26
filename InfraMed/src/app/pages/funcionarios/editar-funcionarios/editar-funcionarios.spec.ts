import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFuncionarios } from './editar-funcionarios';

describe('EditarFuncionarios', () => {
  let component: EditarFuncionarios;
  let fixture: ComponentFixture<EditarFuncionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarFuncionarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarFuncionarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
