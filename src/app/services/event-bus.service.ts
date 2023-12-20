import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  private subjects: { [key: string]: BehaviorSubject<any[]> } = {};

  on(event: string): Observable<any> {    
    if (!this.subjects[event]) {
      this.subjects[event] = new BehaviorSubject<any[]>([]);
    }
    return this.subjects[event].asObservable();
  }

  dispatch(event: string, data?: any) {
    if (this.subjects[event]) {
      this.subjects[event].next(data);
    }
  }

  remove(event: string) {
    if (this.subjects[event]) {
      this.subjects[event].complete();
      delete this.subjects[event];
    }
  }
}
