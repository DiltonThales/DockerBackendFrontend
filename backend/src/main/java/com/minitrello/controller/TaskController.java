package com.minitrello.controller;

import com.minitrello.model.Task;
import com.minitrello.model.TaskStatus;
import com.minitrello.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.findById(id)
                .map(task -> ResponseEntity.ok(task))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task savedTask = taskService.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Task task = taskService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com ID: " + id));
            
            // Atualiza título se fornecido
            if (body.containsKey("title")) {
                task.setTitle(body.get("title"));
            }
            
            // Atualiza descrição se fornecido
            if (body.containsKey("description")) {
                task.setDescription(body.get("description"));
            }
            
            // Atualiza status se fornecido
            if (body.containsKey("status")) {
                String statusStr = body.get("status");
                try {
                    TaskStatus status = TaskStatus.valueOf(statusStr.toUpperCase());
                    task.setStatus(status);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Status inválido. Use: PENDING ou DONE"));
                }
            }
            
            Task updatedTask = taskService.save(task);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

