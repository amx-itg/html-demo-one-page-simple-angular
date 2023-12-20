import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface ThemeState {
  isDarkMode: boolean;
  background: string;
  activeBackground: string;
}
@Injectable({
  providedIn: 'root'
})


export class ThemeService {
  initialState: ThemeState = {
    isDarkMode: true,
    background: 'bg-dark',
    activeBackground: 'bg-dark'
  };


  private themeStateSubject: BehaviorSubject<ThemeState> = new BehaviorSubject<ThemeState>(this.initialState);

  constructor() {}

  getThemeState(): Observable<ThemeState> {
    return this.themeStateSubject.asObservable();
  }

  updateThemeState(value: any): void {
    
    const currentState = this.themeStateSubject.getValue();
    let updatedState: ThemeState;

    if (value) {
      updatedState = {
        ...currentState,
        isDarkMode: value,
        activeBackground: currentState.background
      };
    } else {
      updatedState = {
        ...currentState,
        isDarkMode: value,
        background: currentState.activeBackground,
        activeBackground: 'bg-light'
      };
    }
    this.themeStateSubject.next(updatedState);
  }
}
