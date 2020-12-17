export class Result {
  _id?: string;
  userName: string;
  userEmail: string;
  totalQuestions: number;
  answered: number;
  rightAnswers: number;
  wrongAnswers: number;
  choosedAnswers: Array<any>;
  testSubmitted: boolean;
}
