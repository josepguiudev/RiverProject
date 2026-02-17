//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

export type QuestionType = "shortAnswer" | "longAnswer" | "multipleChoice" | "checkbox" | "dropdown";


export interface Option {
  id: string;
  text: string;
}
// Define la estructura de una respuesta del formulario
export interface Survey {
  id_survey?: number;
  tempId: string;
  numQuestions: number;
  nombre: string;
  creationDate?: string;
  launchDate?: string;
  closeDate?: string;
  questions: Question[];
  generes: Generes[];

}

export interface Generes {
id?: number;
nombre: string;
options?: Option[]; // Solo se usa para choice
}

export interface Question {
  id?: string | number;
  tempId: string;
  type: QuestionType; // Tipos permitidos
  questionText: string;
  options?: Option[]; // Solo se usa para choice
}

// Define la respuesta del API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Solo lo que el usuario ingresa
export interface FormState {
  numQuestions: number;
  nombre: string;
  questions: Question[];
  generes: Generes[];
}

export interface FormErrors {
  numQuestions?: number;
  nombre?: string;
  questions?: Question[];
  generes?: Generes[];
}