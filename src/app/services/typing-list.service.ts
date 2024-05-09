import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { filterByKey, STORAGE_EVENT, toValue } from '@ng-web-apis/storage';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { TAB_ID } from '../tabId';

@Injectable({
  providedIn: 'root'
})
export class TypingListService {
  private storageKey = 'typing_list';

  private storageService = inject(LOCAL_STORAGE);

  private tabId = inject(TAB_ID);

  public typingList: Observable<number[] | null> = inject(STORAGE_EVENT).pipe(
    filterByKey(this.storageKey),
    toValue(),
    startWith(this.storageService.getItem(this.storageKey)),
    map(val => JSON.parse(val || '[]') as number[]),
    map(list => list.filter(id => id !== this.tabId)),
    shareReplay(1)
  );

  public setIsTyping(value: boolean): void {
    let current: number[] = JSON.parse(
      this.storageService.getItem(this.storageKey) || '[]'
    );
    current = current.filter(id => id !== this.tabId);

    if (value) {
      current.push(this.tabId);
    }

    this.storageService.setItem(this.storageKey, JSON.stringify(current));
  }
}
