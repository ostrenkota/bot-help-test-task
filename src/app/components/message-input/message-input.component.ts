import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit
} from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypingListService } from '../../services/typing-list.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent implements OnInit {
  @HostListener('window:beforeunload') beforeUnload() {
    this.typingService.setIsTyping(false);
  }

  @HostListener('window:keydown', ['$event']) onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.control.value) {
      this.onSend();
    }
  }
  public control = new FormControl('');

  private destroyRef = inject(DestroyRef);
  private typingService = inject(TypingListService);
  private messagesService = inject(MessagesService);

  ngOnInit() {
    this.control.valueChanges
      .pipe(
        map(Boolean),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(val => this.typingService.setIsTyping(val));
  }

  onSend(): void {
    this.messagesService.sendMessage(this.control.value!);
    this.control.patchValue('');
  }
}
