import {
  AfterContentInit,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Result } from '../model/answered';
import { CommonCoreService } from '../service/common-core.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent implements OnInit, OnChanges {
  result: any;
  totalQuestions: number = 0;
  totalAnswered: number = 0;
  rightAnswer: number = 0;
  wrongAnswer: number = 0;
  emptyResult: boolean;

  constructor(
    private commonCoreService: CommonCoreService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getScore();
  }

  ngOnChanges(): void {
    this.getScore();
  }

  // ngAfterContentInit(): void {
  //   /** spinner starts on init */
  //   this.spinner.show();

  //   setTimeout(() => {
  //     /** spinner ends after 5 seconds */
  //     this.spinner.hide();
  //   }, 3000);
  // }

  getScore() {
    this.commonCoreService.getResult().subscribe((data: any) => {
      // const isEmpty = JSON.stringify(data)
      const success = data.success;
      if (success == false) {
        this.emptyResult = true;
        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 3000);
      } else {
        this.result = data;
        this.totalQuestions = this.result.data.totalQuestions;
        this.totalAnswered = this.result.data.answered;
        this.rightAnswer = this.result.data.rightAnswers;
        this.wrongAnswer = this.result.data.wrongAnswers;
        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 3000);
      }
      /*       console.log("Total Questions: " + this.totalQuestions);
      console.log("Total Answered: " + this.totalAnswered );
      console.log("Right Answers: " + this.rightAnswer);
      console.log("Wrong Answers: " + this.wrongAnswer);  */
    });
  }
}
