# 🗂️ Tutorial: Crear una API REST con Spring Boot y conectarla a React

---

## PARTE 1 — INTRODUCCIÓN

### ¿Qué vamos a construir?

Una API REST que sigue el patrón clásico de Spring Boot:

```
Base de datos (MySQL/H2)
        ↓
   Repository       ← accede a la BD
        ↓
    Service         ← lógica de negocio + mapeo a DTO
        ↓
   Controller       ← expone el endpoint HTTP
        ↓
   Frontend React   ← consume la API con fetch/axios
```

### ¿Qué es un DTO y para qué sirve?

Un **DTO (Data Transfer Object)** como tu `SurveyRequest.java` es un objeto "intermedio" que decide **qué datos del modelo se mandan al frontend** — no tienes que exponer toda la entidad `Survey` con todos sus campos internos.

```
Entidad Survey (modelo completo de BD)  →  SurveyRequest DTO (solo lo que el front necesita)
```

---

## PARTE 2 — CREACIÓN DEL BACK

### Paso 1: El DTO (ya lo tienes)

Asegúrate de que `SurveyRequest.java` tenga exactamente los campos que el frontend va a consumir:

```java
// src/main/java/com/tuapp/dto/SurveyRequest.java
package com.tuapp.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SurveyRequest {
    private Long id;
    private String name;          // título de la encuesta
    private LocalDate creationDate;
    private LocalDate launchDate;
    private LocalDate closeDate;
    private Integer numQuestions;
    private Integer pago;         // importe del pago asociado
}
```

> ⚠️ **Importante:** Los nombres de los campos aquí deben coincidir con lo que el frontend espera recibir en el JSON.

---

### Paso 2: El Repository

El repositorio le habla directamente a la base de datos. Como usas JPA, Spring genera las queries automáticamente:

```java
// src/main/java/com/tuapp/repository/SurveyRepository.java
package com.tuapp.repository;

import com.tuapp.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    // JpaRepository ya te da: findAll(), findById(), save(), delete()...
    // Si necesitas queries personalizadas las añades aquí
}
```

---

### Paso 3: El Service

El servicio contiene la lógica: obtiene las encuestas de la BD y las **mapea** al DTO:

```java
// src/main/java/com/tuapp/service/SurveyService.java
package com.tuapp.service;

import com.tuapp.dto.SurveyRequest;
import com.tuapp.model.Survey;
import com.tuapp.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Transactional
    public List<SurveyRequest> getAllSurveys() {
        return surveyRepository.findAll()
                .stream()
                .map(this::toDTO)       // convierte cada Survey en SurveyRequest
                .collect(Collectors.toList());
    }

    // Método de mapeo: Survey (entidad) → SurveyRequest (DTO)
    private SurveyRequest toDTO(Survey survey) {
        SurveyRequest dto = new SurveyRequest();
        dto.setId(survey.getId());
        dto.setName(survey.getName());
        dto.setCreationDate(survey.getCreationDate());
        dto.setLaunchDate(survey.getLaunchDate());
        dto.setCloseDate(survey.getCloseDate());
        dto.setNumQuestions(survey.getQuestions() != null
            ? survey.getQuestions().size() : 0);
        // Si el pago está en una entidad relacionada:
        dto.setPago(survey.getPago() != null
            ? survey.getPago().getAmount() : null);
        return dto;
    }
}
```

> 💡 El método `toDTO` es clave — aquí decides qué campos de `Survey` se exponen y con qué nombre.

---

### Paso 4: El Controller

El controlador expone el endpoint HTTP que el frontend llamará:

```java
// src/main/java/com/tuapp/controller/SurveyController.java
package com.tuapp.controller;

import com.tuapp.dto.SurveyRequest;
import com.tuapp.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "http://localhost:5173") // puerto de Vite/React
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    // GET /api/surveys → devuelve todas las encuestas
    @GetMapping
    public ResponseEntity<List<SurveyRequest>> getAllSurveys() {
        List<SurveyRequest> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);
    }

    // GET /api/surveys/{id} → devuelve una encuesta concreta (opcional)
    @GetMapping("/{id}")
    public ResponseEntity<SurveyRequest> getSurveyById(@PathVariable Long id) {
        // puedes ampliar el service para este caso
        return ResponseEntity.notFound().build();
    }
}
```

---

### ✅ Verificación del back

Arranca el backend y prueba en el navegador o con `curl`:

```bash
curl http://localhost:8080/api/surveys
```

Deberías recibir algo como:

```json
[
  {
    "id": 1,
    "name": "Encuesta de satisfacción",
    "creationDate": "2024-01-10",
    "launchDate": "2024-01-15",
    "closeDate": "2024-02-15",
    "numQuestions": 5,
    "pago": 20
  }
]
```

---

## PARTE 3 — CONEXIÓN CON EL FRONT

### Paso 1: Ajusta la interfaz TypeScript

En `ListEncuestas.tsx`, la interfaz debe reflejar **exactamente** los campos del DTO:

```tsx
// Debe coincidir campo a campo con SurveyRequest.java
interface Encuesta {
  id: number;
  name: string;          // ← antes era "titulo", ahora es "name" como en el DTO
  creationDate: string;
  launchDate: string;
  closeDate: string;
  numQuestions: number;
  pago: number | null;
}
```

---

### Paso 2: Haz el fetch a la API real

Sustituye los datos hardcodeados por una llamada real:

```tsx
import { useEffect, useState } from "react";

const ListEncuestas = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/surveys")
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data: Encuesta[]) => {
        setEncuestas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando encuestas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {encuestas.map((e) => (
        <div key={e.id}>
          <h2>{e.name}</h2>
          <p>Preguntas: {e.numQuestions}</p>
          <p>Pago: {e.pago ?? "Sin pago"} €</p>
        </div>
      ))}
    </div>
  );
};

export default ListEncuestas;
```

---

## PARTE 4 — COSAS A TENER EN CUENTA Y EXCEPCIONES

### ⚠️ 1. CORS

El error más común al conectar front y back. Si ves en la consola del navegador:

```
Access to fetch blocked by CORS policy
```

La solución ya está en el controlador con `@CrossOrigin`. Asegúrate de que el puerto coincide con el de tu frontend (Vite usa `5173` por defecto).

---

### ⚠️ 2. Nombres de campos: camelCase vs snake_case

Spring Boot serializa a **camelCase** por defecto (`creationDate`). React debe usar exactamente los mismos nombres. Si cambiases la configuración de Jackson en el back para usar `snake_case` (`creation_date`), tendrías que actualizar la interfaz TypeScript.

---

### ⚠️ 3. Fechas

`LocalDate` en Java se serializa como `"2024-01-10"` (string ISO). En TypeScript el tipo es `string`, no `Date`. Si necesitas formatearla:

```ts
new Date(e.creationDate).toLocaleDateString("es-ES")
```

---

### ⚠️ 4. Relaciones lazy (LazyInitializationException)

Si `Survey` tiene relaciones como `@OneToMany` con preguntas o pagos, y accedes a ellas fuera de una transacción, Spring lanzará `LazyInitializationException`. Solución: añade `@Transactional` al método del service.

```java
@Transactional  // ← añade esto en el service
public List<SurveyRequest> getAllSurveys() { ... }
```

---

### ⚠️ 5. Campos nulos

Si `pago` puede ser `null` en BD, refléjalo en el DTO como `Integer` (no `int`) en Java y como `number | null` en TypeScript. Usa el operador `??` en el frontend para manejar nulos:

```tsx
{e.pago ?? "Sin pago"} €
```

---

### ⚠️ 6. El DTO nunca debe ser la entidad

Nunca retornes directamente un `Survey` desde el controlador. Podrías:
- Exponer datos sensibles de la BD
- Generar referencias circulares en el JSON
- Acoplarte demasiado a la estructura interna

**Siempre mapea a un DTO antes de responder.**

---

## 📌 Resumen del flujo completo

```
MySQL
  → SurveyRepository (acceso a BD)
  → SurveyService (mapeo Survey → DTO)
  → SurveyController (GET /api/surveys)
  → fetch() en React
  → useState()
  → render en el componente
```
