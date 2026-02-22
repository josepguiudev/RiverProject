export interface QuestionOption {
  text_opcion: string;
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
}