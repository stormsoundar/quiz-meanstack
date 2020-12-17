import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { Result } from '../model/answered';
import { CommonCoreService } from '../service/common-core.service';
import { QuestionsOptionsService } from '../service/questions-options.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit, AfterContentInit {
  public questions;
  public result = new Result();
  results: any;
  emptyResult: boolean;
  public answerArray = [];

  totalQuestions: number = 0;
  totalAnswered: number = 0;
  rightAnswer: number = 0;
  wrongAnswer: number = 0;
  testSubmitted = true;
  public ids: number = 0;
  questionObj;
  public userDetails: any;
  public userDetail: any;

  @ViewChild('questionTest') questionTest: any;

  constructor(
    private qustionOptionService: QuestionsOptionsService,
    private commonCoreService: CommonCoreService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getScore();
  }

  ngAfterContentInit(): void {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }

  public getData(): void {
    this.qustionOptionService.getQuestionsOptions().subscribe((data) => {
      this.questions = data;
    });
  }

  public cancelTest(): void {
    this.questionTest.reset();
  }

  public submitTest(): void {
    this.rightAnswer = 0;
    this.totalAnswered = 0;
    for (let i = 0; i < this.questions.length; i++) {
      if (
        'selected' in this.questions[i] &&
        this.questions[i]['selected'] != null
      ) {
        this.totalAnswered++;
        if (this.questions[i]['selected'] == this.questions[i]['answer']) {
          this.rightAnswer++;
        }
        if (this.questions[i]['selected'] != this.questions[i]['answer']) {
          this.wrongAnswer++;
        }
      }

      let choosed = this.questions[i]['selected'];
      this.answerArray.push(choosed);
    }

    this.userDetail = JSON.parse(localStorage.getItem('user'));
    const userDetailsObj = this.userDetail;

    this.result = {
      _id: userDetailsObj.id,
      userName: userDetailsObj.name,
      userEmail: userDetailsObj.email,
      totalQuestions: this.questions.length,
      answered: this.totalAnswered,
      rightAnswers: this.rightAnswer,
      wrongAnswers: this.wrongAnswer,
      choosedAnswers: this.answerArray,
      testSubmitted: this.testSubmitted,
    };
    this.commonCoreService
      .submitTest(this.result)
      .subscribe((result: Result) => {
        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 3000);
        this.toastr.success('Test Submitted Successfully', 'Welcome');
      });
    this.questionTest.reset();
  }

  getScore() {
    this.commonCoreService.getResult().subscribe((data: any) => {
      if (data.success == false) {
        this.emptyResult = true;
        /** spinner starts on init */
        this.spinner.show();

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 3000);
      }
    });
  }
}
