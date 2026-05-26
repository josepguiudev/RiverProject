import React from 'react';
import { NumericStat } from './NumericStat';
import { SingleChoiceStat } from './SingleChoiceStat';
import { MultipleChoiceStat } from './MultipleChoiceStat';
import { ShortTextStat } from './ShortTextStat';

interface Props {
  question: {
    type: 'NUMERIC' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SHORT_TEXT';
    [key: string]: any;
  };
}

export const AnalyticsRenderer = ({ question }: Props) => {
  switch (question.type) {
    case 'NUMERIC':
      return <NumericStat title={question.title} average={question.average} max={question.max} />;
    case 'SINGLE_CHOICE':
      return <SingleChoiceStat title={question.title} results={question.results} />;
    case 'MULTIPLE_CHOICE':
      return <MultipleChoiceStat title={question.title} results={question.results} totalParticipants={question.totalParticipants} />;
    case 'SHORT_TEXT':
      return <ShortTextStat title={question.title} responses={question.responses} />;
    default:
      return null;
  }
};