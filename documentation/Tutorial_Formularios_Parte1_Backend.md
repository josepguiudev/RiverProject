# 📚 Tutorial Completo: Sistema de Formularios - PARTE 1: BACKEND

## 🎯 Objetivo del Tutorial

Este documento te guiará paso a paso en la creación del backend de un sistema de formularios similar a Google Forms con Spring Boot.

**Nivel:** Intermedio  
**Enfoque:** Educativo y práctico

---

## 1. Arquitectura Backend: Spring Boot

### 1.1 ¿Por qué Spring Boot?

Spring Boot simplifica la creación de aplicaciones empresariales en Java.

**Ventajas clave:**
- ✅ **Auto-configuración**: Menos código boilerplate
- ✅ **Inyección de dependencias**: Spring gestiona objetos
- ✅ **Ecosistema maduro**: Soluciones probadas
- ✅ **Producción-ready**: Métricas incluidas

### 1.2 Patrón de Arquitectura en Capas

```
┌──────────────┐
│  Controller  │  → Maneja peticiones HTTP
└──────┬───────┘
       ↓
┌──────────────┐
│   Service    │  → Lógica de negocio
└──────┬───────┘
       ↓
┌──────────────┐
│  Repository  │  → Acceso a datos
└──────┬───────┘
       ↓
┌──────────────┐
│   Database   │  → Persistencia
└──────────────┘
```

**¿Por qué separar en capas?**
- **Responsabilidad Única**: Cada capa tiene un propósito
- **Mantenibilidad**: Cambios aislados
- **Testabilidad**: Más fácil hacer tests
- **Escalabilidad**: Puedes separar capas en servicios

---

## 2. Capa Model (Entidad JPA)

### 2.1 Ubicación
`src/main/java/com/tuapp/model/FormResponse.java`

### 2.2 Código con Explicaciones

```java
package com.tuapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// @Entity: Convierte esta clase en una tabla de base de datos
// JPA (Java Persistence API) hace la magia
@Entity

// @Table: Especifica el nombre de la tabla
// Sin esto, JPA usaría "FormResponse" como nombre
@Table(name = "form_responses")
public class FormResponse {
    
    // @Id: Clave primaria de la tabla
    @Id
    
    // @GeneratedValue: El ID se auto-genera
    // IDENTITY: La BD asigna valores auto-incrementales (1, 2, 3...)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Campos simples → Columnas en la tabla
    private String nombre;
    private String email;
    
    // @Column: Personaliza el nombre de la columna
    // Java: camelCase (fechaEnvio)
    // BD: snake_case (fecha_envio)
    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;
    
    // Constructor vacío - OBLIGATORIO para JPA
    // JPA usa reflexión para crear objetos
    public FormResponse() {
        this.fechaEnvio = LocalDateTime.now();
    }
    
    // Constructor con parámetros - Para desarrolladores
    public FormResponse(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
        this.fechaEnvio = LocalDateTime.now();
    }
    
    // Getters y Setters - OBLIGATORIOS para JPA
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { 
        this.fechaEnvio = fechaEnvio; 
    }
}
```

### 2.3 Conceptos Clave

#### **ORM (Object-Relational Mapping)**

JPA traduce automáticamente:

```
Clase Java              →    Tabla SQL
FormResponse            →    form_responses
campo: Long id          →    columna: BIGINT id
campo: String nombre    →    columna: VARCHAR nombre
```

#### **¿Cómo se crea la tabla?**

Con `spring.jpa.hibernate.ddl-auto=update`, Hibernate genera:

```sql
CREATE TABLE form_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255),
    fecha_envio TIMESTAMP
);
```

---

## 3. Capa Repository (Acceso a Datos)

### 3.1 Ubicación
`src/main/java/com/tuapp/repository/FormResponseRepository.java`

### 3.2 Código con Explicaciones

```java
package com.tuapp.repository;

import com.tuapp.model.FormResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// @Repository: Marca esta interfaz como componente de datos
@Repository

// JpaRepository<T, ID>
// T = FormResponse: Tipo de entidad
// ID = Long: Tipo de la clave primaria
public interface FormResponseRepository extends JpaRepository<FormResponse, Long> {
    // ¡No necesitas implementar nada!
    // Spring Data JPA crea automáticamente:
    // - save(entity)
    // - findById(id)
    // - findAll()
    // - deleteById(id)
    // - count()
    // - existsById(id)
    
    // Puedes agregar métodos personalizados:
    // List<FormResponse> findByNombre(String nombre);
    // Spring genera el SQL automáticamente
}
```

### 3.3 Conceptos Clave

#### **Spring Data Magic**

Cuando defines:
```java
List<FormResponse> findByNombre(String nombre);
```

Spring genera automáticamente:
```sql
SELECT * FROM form_responses WHERE nombre = ?
```

#### **Convenciones de nombres**

| Método Java | SQL Generado |
|-------------|--------------|
| `findByNombre(String nombre)` | `WHERE nombre = ?` |
| `findByEmailContaining(String email)` | `WHERE email LIKE %?%` |
| `findByNombreAndEmail(String n, String e)` | `WHERE nombre = ? AND email = ?` |
| `countByNombre(String nombre)` | `SELECT COUNT(*) WHERE nombre = ?` |

---

## 4. Capa Service (Lógica de Negocio)

### 4.1 Ubicación
`src/main/java/com/tuapp/service/FormService.java`

### 4.2 Código con Explicaciones

```java
package com.tuapp.service;

import com.tuapp.model.FormResponse;
import com.tuapp.repository.FormResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

// @Service: Marca esta clase como componente de lógica de negocio
@Service
public class FormService {
    
    // @Autowired: Inyección de Dependencias
    // Spring automáticamente inyecta una instancia de Repository
    @Autowired
    private FormResponseRepository repository;
    
    // Guardar respuesta
    public FormResponse guardarRespuesta(FormResponse respuesta) {
        // Aquí iría lógica de negocio:
        // - Validaciones complejas
        // - Transformaciones
        // - Llamadas a otros servicios
        // - Envío de notificaciones
        
        // Ejemplo: Normalizar email
        respuesta.setEmail(respuesta.getEmail().toLowerCase());
        
        return repository.save(respuesta);
    }
    
    // Obtener todas las respuestas
    public List<FormResponse> obtenerTodasRespuestas() {
        return repository.findAll();
    }
    
    // Obtener por ID
    public FormResponse obtenerRespuestaPorId(Long id) {
        // findById retorna Optional<FormResponse>
        // orElse(null) retorna null si no existe
        return repository.findById(id).orElse(null);
    }
}
```

### 4.3 Conceptos Clave

#### **Inyección de Dependencias**

```java
// ❌ Mal: Crear manualmente
private FormResponseRepository repository = new FormResponseRepositoryImpl();

// ✅ Bien: Dejar que Spring lo inyecte
@Autowired
private FormResponseRepository repository;
```

**Ventajas:**
- Spring gestiona el ciclo de vida
- Singleton por defecto (eficiente)
- Fácil cambiar implementación
- Facilita testing (inyectar mocks)

#### **3 formas de inyección**

```java
// 1. Por campo (la más simple)
@Autowired
private FormResponseRepository repository;

// 2. Por setter
private FormResponseRepository repository;
@Autowired
public void setRepository(FormResponseRepository repository) {
    this.repository = repository;
}

// 3. Por constructor (RECOMENDADA)
private final FormResponseRepository repository;
@Autowired
public FormService(FormResponseRepository repository) {
    this.repository = repository;
}
```

---

## 5. Capa Controller (Endpoints HTTP)

### 5.1 Ubicación
`src/main/java/com/tuapp/controller/FormController.java`

### 5.2 Código con Explicaciones

```java
package com.tuapp.controller;

import com.tuapp.model.FormResponse;
import com.tuapp.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController: Combinación de @Controller + @ResponseBody
// Los retornos se convierten automáticamente a JSON
@RestController

// @RequestMapping: Prefijo para todas las rutas
// Todas las rutas empiezan con /api/forms
@RequestMapping("/api/forms")

// @CrossOrigin: Permite peticiones desde otros dominios
// Necesario para que React Native pueda conectar
@CrossOrigin(origins = "*")
public class FormController {
    
    @Autowired
    private FormService formService;
    
    // POST /api/forms/submit
    @PostMapping("/submit")
    public ResponseEntity<FormResponse> submitForm(
            @RequestBody FormResponse respuesta
    ) {
        try {
            FormResponse guardada = formService.guardarRespuesta(respuesta);
            
            // ResponseEntity permite controlar el código HTTP
            // 201 Created: Recurso creado exitosamente
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(guardada);
                    
        } catch (Exception e) {
            // 500 Internal Server Error
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    
    // GET /api/forms/responses
    @GetMapping("/responses")
    public ResponseEntity<List<FormResponse>> getAllResponses() {
        try {
            List<FormResponse> respuestas = formService.obtenerTodasRespuestas();
            
            // ResponseEntity.ok() es atajo para status 200
            return ResponseEntity.ok(respuestas);
            
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    
    // GET /api/forms/test
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend funcionando correctamente!");
    }
}
```

### 5.3 Conceptos Clave

#### **Códigos de Estado HTTP**

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 OK | Éxito | GET exitoso |
| 201 Created | Recurso creado | POST exitoso |
| 400 Bad Request | Error del cliente | Validación falla |
| 404 Not Found | No encontrado | Recurso no existe |
| 500 Internal Server Error | Error del servidor | Excepción |

#### **Conversión automática JSON ↔ Java**

```java
// Cliente envía:
{
  "nombre": "Juan",
  "email": "juan@email.com"
}

// Spring convierte a:
FormResponse respuesta = new FormResponse();
respuesta.setNombre("Juan");
respuesta.setEmail("juan@email.com");

// Método retorna:
return ResponseEntity.ok(respuesta);

// Spring convierte a:
{
  "id": 1,
  "nombre": "Juan",
  "email": "juan@email.com",
  "fechaEnvio": "2024-01-15T10:30:00"
}
```

---

## 6. Configuración

### 6.1 application.properties

**Ubicación:** `src/main/resources/application.properties`

```properties
# Puerto del servidor
server.port=8080

# Base de datos H2 (en memoria)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Consola H2
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

#### **Opciones de ddl-auto**

| Valor | Comportamiento |
|-------|----------------|
| `none` | No hace nada con el esquema |
| `create` | Borra y crea tablas (PIERDES DATOS) |
| `create-drop` | Crea al inicio, borra al apagar |
| `update` | Actualiza esquema (RECOMENDADO desarrollo) |
| `validate` | Solo valida que coincida |

### 6.2 pom.xml (Dependencias Maven)

```xml
<dependencies>
    <!-- Spring Boot Web (REST API) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA (ORM) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Base de datos H2 -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 7. Flujo Completo de una Petición

```
1. Cliente envía: POST /api/forms/submit
   Body: {"nombre": "Juan", "email": "juan@email.com"}
   
2. Spring recibe la petición en FormController
   
3. @RequestBody convierte JSON → FormResponse object
   
4. Controller llama: formService.guardarRespuesta(respuesta)
   
5. Service normaliza email y llama: repository.save(respuesta)
   
6. JPA genera: INSERT INTO form_responses (nombre, email, fecha_envio) VALUES (?, ?, ?)
   
7. Base de datos asigna ID y retorna el registro
   
8. Repository retorna FormResponse con ID
   
9. Service retorna a Controller
   
10. Controller envuelve en ResponseEntity con código 201
   
11. Spring convierte FormResponse → JSON
   
12. Cliente recibe: 
    Status: 201 Created
    Body: {"id": 1, "nombre": "Juan", "email": "juan@email.com", "fechaEnvio": "..."}
```

---

## 8. Ejecutar el Backend

### 8.1 Con Maven
```bash
./mvnw spring-boot:run
```

### 8.2 Con IDE
- Ejecutar clase principal con `@SpringBootApplication`

### 8.3 Verificar
- Servidor: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console
- Test: GET http://localhost:8080/api/forms/test

---

## ✅ Resumen Backend

Has aprendido:
1. ✅ Arquitectura en capas (Controller → Service → Repository)
2. ✅ ORM con JPA/Hibernate
3. ✅ REST API con Spring Boot
4. ✅ Inyección de dependencias
5. ✅ Manejo de peticiones HTTP
6. ✅ Configuración con properties

**Próximo paso:** Frontend con React Native y TypeScript
