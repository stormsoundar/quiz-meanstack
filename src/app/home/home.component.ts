import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  images = [
    { path: './assets/images/3.jpg' },
    { path: './assets/images/4.jpg' },
    { path: './assets/images/7.jpg' },
  ];
}
