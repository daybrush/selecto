import { Component } from '@angular/core';
import { OnKeyEvent, OnSelect, OnSelectEnd } from 'selecto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  dragContainer = window;

  onKeydown(event: OnKeyEvent) {
    document.querySelector('.button')!.classList.add('selected');
  }

  onKeyup(event: OnKeyEvent) {
    document.querySelector('.button')!.classList.remove('selected');
  }

  onSelectStart(e: OnSelect) {
    console.log('start', e);
    e.added.forEach((el) => {
      el.classList.add('selected');
    });
    e.removed.forEach((el) => {
      el.classList.remove('selected');
    });
  }

  onSelectEnd(e: OnSelectEnd) {
    console.log('end', e);
    e.afterAdded.forEach((el) => {
      el.classList.add('selected');
    });
    e.afterRemoved.forEach((el) => {
      el.classList.remove('selected');
    });
  }
}
