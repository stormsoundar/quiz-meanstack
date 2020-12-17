import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionOptions } from '../model/question-options.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionsOptionsService {
  constructor(private httpClient: HttpClient) {}

  getQuestionsOptions() {
    return this.httpClient.get("assets/data/questions-options.json");
  } 

  // getQuestionsOptions(): Observ {
  //   return this.httpClient.get("../../assets/data/questions-options.json");
  // }
}
