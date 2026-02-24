export interface QuestionOption {
  text_opcion: string;
}

export interface GenereOption {
  text_opcion: string;
}

export interface Genere {
  genere: string;
  type_name: 'Global' | 'Shooters' | 'Acción-Aventura' | 'RPGs';
  options?: GenereOption[]; 
}


export interface Question {
  text_question: string;
  type_name: 'SHORT_TEXT' | 'NUMERIC' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE';
  options?: QuestionOption[]; 
}

export interface Survey {
  name: string;
  numQuestions: number;
  launchDate?: string; 
  questionList: Question[];
  genereList: Genere[];
  SurveyReward: number;
}

