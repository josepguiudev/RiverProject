export interface QuestionOption {
  id?: number;              // Opcional: El backend lo genera
  textOpcion: string;       // Coincide con Java 'textOpcion'
}

export interface Question {
  id?: number;
  textQuestion: string;
  
  config: {
    typeName: 'SHORT_TEXT' | 'NUMERIC' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE';
    isMultiple: boolean;
    attributes?: string | null;
  };

  option?: QuestionOption[]; 
  options?: QuestionOption[]; 
}

export interface Survey {
  id?: number;
  name: string;
  numQuestions: number;
  numUsers: number;
  questionList: Question[];
  
  // Campos de Tracking y Relaciones
  categoryList: Category[]; 
  genereList: Genere[];
  launchDate?: string; 
  closeDate?: string;
  
  // Metadatos de Negocio
  creationDate?: string;
  SurveyReward?: number;
  idPagoPanelista?: number;
  completada?: boolean;
  status: boolean;
  supersetID?:string;
}

// --- Tipos de Apoyo ---

export interface CategoryOption {
  textOpcion: string;
}
export interface GenereOption { 
  textOpcion: string; 
}

export interface Category {
  id: number;
  name: string;      // Este es el que debes mostrar
  typeName?: string; // Esto suele ser interno (ej: 'steam_cat')
}

export interface Genere {
  id: number;
  genere: string;    // Este es el que debes mostrar (Action, Adventure...)
  typeName: 'Global' | 'Shooters' | 'Acción-Aventura' | 'RPGs';
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