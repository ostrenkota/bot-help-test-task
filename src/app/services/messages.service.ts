import { inject, Injectable } from '@angular/core';
import {
  filterByKey,
  STORAGE_EVENT,
  StorageService,
  toValue
} from '@ng-web-apis/storage';
import { Message } from '../models/message';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { TAB_ID } from '../tabId';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private storageKey = 'messages';

  private tabId = inject(TAB_ID);

  private storageService = inject(StorageService);

  public messages$: Observable<Message[] | null> = inject(STORAGE_EVENT).pipe(
    filterByKey(this.storageKey),
    toValue(),
    startWith(this.storageService.getItem(this.storageKey)),
    map(val => JSON.parse(val || '[]')),
    shareReplay(1)
  );

  public sendMessage(text: string) {
    const messages: Message[] = JSON.parse(
      this.storageService.getItem(this.storageKey) || '[]'
    );

    messages.push({ text, sender: this.tabId, timestamp: Date.now() });

    this.storageService.setItem(this.storageKey, JSON.stringify(messages));
  }
}
