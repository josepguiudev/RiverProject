export interface QuestionOption {
  id: number;
  idOpcion?: number; 
  textOpcion: string;
  textoOpcion?: string; 
}

export interface Question {
  id: number;
  idPregunta?: number;
  textQuestion: string;
  textoPregunta?: string;
  typeName: 'SHORT_TEXT' | 'NUMERIC' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE';
  options?: QuestionOption[]; 
  opcionesDisponibles?: QuestionOption[];
  idOpcionSeleccionada?: number;
}

export interface Survey {
  id: number;
  idEncuesta?: number;
  name: string;
  nombreEncuesta?: string;
  numQuestions: number;
  launchDate?: string; 
  questionList: Question[];
  preguntas?: Question[];
  genereList: Genere[];
  SurveyReward: number;
  completada?: boolean;
}


export interface GenereOption { textOpcion: string; }
export interface Genere {
  genere: string;
  typeName: 'Global' | 'Shooters' | 'Acción-Aventura' | 'RPGs';
  options?: GenereOption[]; 
}

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

export interface EncuestaParcialDTO {
  idEncuesta: number;
  completada: boolean;
  respuestas: RespuestaDTO[];
  nombreEncuesta?: string;
  preguntas?: Question[]; 
}