import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Task {
  id?: number;
  title: string;
  description: string;
  status: 'PENDING' | 'DONE';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', status: 'PENDING' };
  editMode: number | null | undefined = null;
  editedTask: Task = { title: '', description: '', status: 'PENDING' };
  
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Erro ao carregar tarefas:', err)
    });
  }

  addTask() {
    if (!this.newTask.title.trim() || !this.newTask.description.trim()) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    this.http.post<Task>(this.apiUrl, this.newTask).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', status: 'PENDING' };
        this.loadTasks();
      },
      error: (err) => console.error('Erro ao adicionar tarefa:', err)
    });
  }

  updateStatus(task: Task) {
    const newStatus = task.status === 'PENDING' ? 'DONE' : 'PENDING';
    this.http.put(`${this.apiUrl}/${task.id}`, { status: newStatus }).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erro ao atualizar status:', err)
    });
  }

  startEdit(task: Task) {
    this.editMode = task.id;
    this.editedTask = { ...task };
  }

  saveEdit() {
    if (!this.editedTask.title.trim() || !this.editedTask.description.trim()) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Envia todos os campos para atualização
    this.http.put(`${this.apiUrl}/${this.editedTask.id}`, {
      title: this.editedTask.title,
      description: this.editedTask.description,
      status: this.editedTask.status
    }).subscribe({
      next: () => {
        this.editMode = null;
        this.loadTasks();
      },
      error: (err) => console.error('Erro ao editar tarefa:', err)
    });
  }

  cancelEdit() {
    this.editMode = null;
  }

  deleteTask(id: number | undefined) {
    if (id && confirm('Deseja realmente excluir esta tarefa?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Erro ao excluir tarefa:', err)
      });
    }
  }

  getStatusClass(status: string) {
    return status === 'DONE' ? 'status-done' : 'status-pending';
  }

  getStatusLabel(status: string) {
    return status === 'DONE' ? 'Concluída' : 'Pendente';
  }
}

