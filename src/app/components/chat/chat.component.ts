import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageInputComponent } from '../message-input/message-input.component';
import { MessagesHistoryComponent } from '../messages-history/messages-history.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MessageInputComponent, MessagesHistoryComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {}
