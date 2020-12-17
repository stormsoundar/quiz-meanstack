import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Result } from '../model/answered';

@Injectable({
  providedIn: 'root'
})
export class CommonCoreService implements OnInit {
  public hostUrl = 'http://localhost:3000';
  constructor(public httpClient: HttpClient) {}

   ngOnInit(): void {
    this.getResult();
  }

  submitTest(result: Result) {
    const url = `${this.hostUrl}/quiz`;
    return this.httpClient.post(url, result);
  }

  getResult() {
    const getId = JSON.parse(localStorage.getItem('user'));
    const id = getId.id;
    const url = `${this.hostUrl}/score/` + id;
    return this.httpClient.get(url);
  }
}
