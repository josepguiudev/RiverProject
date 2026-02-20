# 🗂️ Tutorial: Crear una API REST con Spring Boot y conectarla a React Native

---

## PARTE 1 — INTRODUCCIÓN

### ¿Qué vamos a construir?

Un endpoint `GET /api/surveys` que consulta la base de datos MySQL y devuelve los datos de las encuestas al componente `ListEncuestas.tsx` de React Native.

El flujo completo es:

```
MySQL (XAMPP)
    ↓
SurveyRepository.java    ← 1. accede a la BD (generado por Spring JPA)
    ↓
SurveyService.java       ← 2. transforma Survey → SurveyRequest (DTO)
    ↓
SurveyController.java    ← 3. expone GET /api/surveys
    ↓
ListEncuestas.tsx        ← 4. hace fetch() y muestra los datos
```

### ¿Qué es un DTO?

Un **DTO (Data Transfer Object)** como `SurveyRequest.java` decide **qué datos de la entidad se mandan al frontend**. No expones toda la entidad `Survey` con sus listas de preguntas, géneros, etc —solo lo que el front necesita.

```
Survey (entidad completa de BD)  →  SurveyRequest (solo los campos que necesita el front)
```

> En este proyecto el DTO es un **Java Record**: inmutable, sin getters/setters, sin Lombok. Solo declaras los campos y Java lo genera todo.

---

## PARTE 2 — BACKEND (4 pasos)

---

### ✅ Paso 1 — El DTO (ya lo tienes)

**¿Qué hace?** Define qué campos viajan de Java al JSON que recibe el frontend.

**Archivo:** `src/main/java/com/equipo/backend/dto/SurveyRequest.java`

```java
package com.equipo.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SurveyRequest(
        Long id,
        String name,
        LocalDateTime creationDate,  // Timestamp en BD → LocalDateTime → String ISO en JSON
        LocalDateTime launchDate,    // nullable → puede llegar como null al frontend
        LocalDate closeDate,         // java.sql.Date → LocalDate → "YYYY-MM-DD" en JSON
        Integer numQuestions,        // Integer (con mayúscula) para que pueda ser null
        Integer pago                 // null si la encuesta no tiene pago asociado
) { }
```

> **Regla clave:** El nombre de cada campo aquí (`name`, `pago`, `numQuestions`...) es exactamente el nombre de clave que aparecerá en el JSON. La interfaz TypeScript del frontend debe usar los mismos nombres.

**Nada que crear — ya existe.**

---

### ✅ Paso 2 — El Repository

**¿Qué hace?** Habla directamente con la base de datos. Spring Data JPA genera automáticamente las queries básicas (`findAll`, `findById`, `save`...) — no escribes SQL.

**Archivo a crear:** `src/main/java/com/equipo/backend/repository/SurveyRepository.java`

```java
package com.equipo.backend.repository;

import com.equipo.backend.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    // Spring genera automáticamente: findAll(), findById(), save(), deleteById()...
    // Si en el futuro necesitas buscar por nombre o fecha, las añades aquí:
    // List<Survey> findByName(String name);
    // List<Survey> findByLaunchDateAfter(Timestamp fecha);
}
```

> **¿Por qué es una `interface` y no una clase?** Porque Spring la implementa por ti en tiempo de arranque. Tú solo declaras qué entidad (`Survey`) y qué tipo de ID (`Long`) maneja.

---

### ✅ Paso 3 — El Service

**¿Qué hace?** Contiene la lógica: obtiene los `Survey` de la BD y los **transforma** al DTO `SurveyRequest`. Este paso de transformación se llama **mapeo**.

**Archivo a crear:** `src/main/java/com/equipo/backend/service/SurveyService.java`

```java
package com.equipo.backend.service;

import com.equipo.backend.dto.SurveyRequest;
import com.equipo.backend.model.Survey;
import com.equipo.backend.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Transactional  // ← OBLIGATORIO (ver sección de errores comunes)
    public List<SurveyRequest> getAllSurveys() {
        return surveyRepository.findAll()   // 1. obtiene todos los Survey de la BD
                .stream()
                .map(this::toDTO)           // 2. convierte cada Survey a SurveyRequest
                .toList();
    }

    // Mapeo: Survey (entidad) → SurveyRequest (DTO)
    // Este método es privado: nadie fuera del service lo necesita.
    private SurveyRequest toDTO(Survey survey) {
        return new SurveyRequest(
            survey.getId(),
            survey.getName(),
            // survey.getCreationDate() devuelve java.sql.Timestamp
            // .toLocalDateTime() lo convierte al tipo que espera el DTO
            survey.getCreationDate() != null ? survey.getCreationDate().toLocalDateTime() : null,
            survey.getLaunchDate()   != null ? survey.getLaunchDate().toLocalDateTime()   : null,
            // survey.getCloseDate() devuelve java.sql.Date
            // .toLocalDate() lo convierte al tipo que espera el DTO
            survey.getCloseDate()    != null ? survey.getCloseDate().toLocalDate()        : null,
            // numQuestions es un campo directo en Survey (int), no hay que calcularlo
            survey.getNumQuestions(),
            // pago es una relación @OneToOne, puede ser null si la encuesta no tiene pago
            // Pago.getPagoEnquesta() devuelve double → lo casteamos a Integer
            survey.getPago() != null ? (int) survey.getPago().getPagoEnquesta() : null
        );
    }
}
```

> **¿Por qué `@Transactional`?** `Survey` tiene relaciones `@OneToMany` (preguntas, géneros) y `@OneToOne` (pago) que JPA carga de forma perezosa (lazy). Sin `@Transactional`, al intentar acceder a `survey.getPago()` dentro de `toDTO` Spring lanza `LazyInitializationException` porque la sesión de BD ya se cerró.

---

### ✅ Paso 4 — El Controller

**¿Qué hace?** Expone el endpoint HTTP `GET /api/surveys`. Recibe la petición del frontend, llama al service y devuelve el JSON.

**Archivo a crear:** `src/main/java/com/equipo/backend/controller/SurveyController.java`

```java
package com.equipo.backend.controller;

import com.equipo.backend.dto.SurveyRequest;
import com.equipo.backend.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController                      // Indica que esta clase gestiona peticiones REST
@RequestMapping("/api/surveys")      // Prefijo de todas las rutas de este controller
@CrossOrigin(origins = "*")          // Permite peticiones desde cualquier origen (React Native / Expo)
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    // GET http://localhost:8080/api/surveys
    @GetMapping
    public ResponseEntity<List<SurveyRequest>> getAllSurveys() {
        List<SurveyRequest> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);  // 200 OK + lista en el body
    }
}
```

---

### 🧪 Verificación del backend

**1.** Arranca el backend (Spring Boot + XAMPP MySQL)

**2.** Abre Postman o el navegador y haz:
```
GET http://localhost:8080/api/surveys
```

**3.** Debes recibir un `200 OK` con un array JSON:
```json
[
  {
    "id": 1,
    "name": "Encuesta de satisfacción",
    "creationDate": "2024-01-10T10:00:00",
    "launchDate": "2024-01-15T09:00:00",
    "closeDate": "2024-02-15",
    "numQuestions": 5,
    "pago": 20
  },
  {
    "id": 2,
    "name": "Encuesta sin pago",
    "creationDate": "2024-02-01T08:30:00",
    "launchDate": null,
    "closeDate": null,
    "numQuestions": 3,
    "pago": null
  }
]
```

Si el array llega vacío `[]`, la tabla `survey` de la BD está vacía — inserta alguna fila de prueba.

---

## PARTE 3 — FRONTEND (2 pasos)

---

### ✅ Paso 1 — Actualiza la interfaz TypeScript

En `ListEncuestas.tsx`, la interfaz `Encuesta` debe reflejar **exactamente** los mismos campos y nombres que `SurveyRequest.java`. Los campos opcionales (`?`) son los que pueden llegar como `null` desde el backend.

```tsx
// frontend/app/components/Cards/ListEncuestas.tsx

export interface Encuesta {
  id: number;
  name: string;            // SurveyRequest.name
  creationDate?: string;   // LocalDateTime → string ISO "2024-01-10T10:00:00"
  launchDate?: string;     // nullable en BD → puede ser null
  closeDate?: string;      // LocalDate → string "YYYY-MM-DD"
  numQuestions?: number;
  pago?: number | null;    // null si no hay pago
}
```

---

### ✅ Paso 2 — Reemplaza los datos mock por fetch real

En `ListEncuestas.tsx`, sustituye el bloque `// TO DO: HACER CONEXIÓN CON API` por la llamada real:

```tsx
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/surveys");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data: Encuesta[] = await response.json();
    setEncuestas(data);
  } catch (error) {
    console.error("Error al obtener encuestas:", error);
  }
};
```

> ⚠️ **Dispositivos físicos o emulador Android:** `localhost` apunta al propio dispositivo, no al PC. Usa la IP local del PC (ej. `192.168.1.45`) en su lugar:
> ```tsx
> fetch("http://192.168.1.45:8080/api/surveys")
> ```
> Para saber tu IP local: abre una terminal y escribe `ipconfig` (Windows).

---

## PARTE 4 — ERRORES COMUNES

| Error | Causa | Solución |
|---|---|---|
| `LazyInitializationException` | Acceder a `survey.getPago()` sin `@Transactional` | Añadir `@Transactional` al método del service |
| `Access to fetch blocked by CORS` | El navegador bloquea la petición cross-origin | `@CrossOrigin(origins = "*")` en el controller |
| El JSON llega con `null` en campos de fechas | La BD los tiene vacíos | Normal si son `nullable = true`. Manéjalo en el frontend con `??` |
| `Network request failed` en Expo | `localhost` no apunta al PC | Usar la IP local del PC en lugar de `localhost` |
| Array vacío `[]` | La tabla `survey` está vacía | Insertar filas de prueba en la BD |
| `ClassCastException` al castear pago | `getPagoEnquesta()` devuelve `double` no `int` | Usar `(int)` o cambiar el DTO a `Double` |

---

### ⚠️ Norma fundamental: nunca devuelvas la entidad directamente

```java
// ❌ MAL — expone datos internos, puede generar JSON circular
return ResponseEntity.ok(surveyRepository.findAll());

// ✅ BIEN — solo expones lo que el front necesita
return ResponseEntity.ok(surveyService.getAllSurveys());
```

`Survey` tiene listas anidadas (`questionList`, `genereList`) que generarían un JSON enorme o referencias circulares. El DTO actúa como filtro.

---

## 📌 Resumen del flujo completo

```
MySQL (XAMPP)
  → SurveyRepository.java   findAll() → List<Survey>
  → SurveyService.java      toDTO()   → List<SurveyRequest>
  → SurveyController.java   GET /api/surveys → JSON
  → fetch() en ListEncuestas.tsx
  → setEncuestas(data)
  → FlatList → EncuestaCard (name, pago)
```
