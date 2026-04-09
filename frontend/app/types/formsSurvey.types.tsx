export interface QuestionOption {
  id?: number;              // Opcional: El backend lo genera
  textOpcion: string;       // Coincide con Java 'textOpcion'
}

export interface Question {
  id?: number;              // Opcional para creación
  textQuestion: string;     // Coincide con Java 'textQuestion'
  typeName: 'SHORT_TEXT' | 'NUMERIC' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE';
  
  // Usamos 'option' (singular) para que Jackson lo mapee directo a tu List<Option> option
  option?: QuestionOption[]; 
  
  // Mantenemos 'options' solo si lo usas internamente en el estado de React
  options?: QuestionOption[]; 
}

export interface Survey {
  id?: number;              // Opcional para creación
  name: string;
  numUsers: number;             // Coincide con Java 'name'
  numQuestions: number;     // Coincide con Java 'numQuestions'
  questionList: Question[]; // Coincide con Java 'questionList'
  idPagoPanelista?: number; 
  
  // Campos opcionales para que TypeScript no bloquee el POST
  launchDate?: string; 
  genereList?: Genere[];
  SurveyReward?: number;
  completada?: boolean;
}

// --- Tipos de Apoyo ---

export interface GenereOption { 
  textOpcion: string; 
}

export interface Genere {
  genere: string;
  typeName: 'Global' | 'Shooters' | 'Acción-Aventura' | 'RPGs';
  options?: GenereOption[]; 
}

// --- DTOs para envío de respuestas ---

export interface RespuestaDTO {
  idPregunta: number;   
  idOpcion?: number;    
  valor?: string;      
  isRespondida?: boolean;
}

export interface EncuestaRespuestaDTO {
  idEncuesta: number;  
  idUser: number;       
  respuestas: RespuestaDTO[];
}

export interface PreguntaCargadaDTO {
    idPregunta: number;
    textoPregunta: string;
    idOpcionSeleccionada?: number; // Mantenlo por compatibilidad
    idsOpcionesSeleccionadas: number[]; // <--- AÑADE ESTO (Array de números)
    valorRespuesta?: string;
    esMultiple: boolean; // <--- AÑADE ESTO para saber si es Radio o Checkbox
    opcionesDisponibles: OpcionDisponibleDTO[];
}

export interface OpcionDisponibleDTO {
    idOpcion: number;
    textoOpcion: string;
}

export interface OpcionDisponibleDTO {
  idOpcion: number;
  textoOpcion: string; // Coincide con Java oDTO.setTextoOpcion
}

export interface EncuestaParcialDTO {
  idEncuesta: number;
  nombreEncuesta: string;
  completada: boolean;
  preguntas: PreguntaCargadaDTO[]; // <--- Usa el nuevo tipo, no Question
}

export interface UserSurveyRel {
  id: number;
  isRespondida: number; 
  survey: Survey; 
}

export interface SurveySummaryDTO {
  id: number;           // ID de la relación user_survey
  idSurvey: number;     // ID de la encuesta
  name: string;         // Título
  isRespondida: boolean; // Estado corregido
}