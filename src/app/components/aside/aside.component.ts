import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TAB_ID } from '../../tabId';
import { TypingListService } from '../../services/typing-list.service';
import { AsyncPipe, NgStyle } from '@angular/common';
import { LetDirective } from '../directives/ng-let.directive';
import { numberToColor } from '../../utils';

@Component({
  selector: 'app-aside',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, LetDirective, NgStyle],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  public tabId = inject(TAB_ID);

  public avatarColor = numberToColor(this.tabId);

  public typingList$ = inject(TypingListService).typingList;
}
