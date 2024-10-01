import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storage: Storage;
  constructor() { 
    this.storage = window.localStorage;
  }

  public set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  public get(key: string): any {
    return this.storage.getItem(key);
  }
  public getAll() {
    this.storage.length;
  }

  public clear() {
    this.storage.clear();
  }
}
