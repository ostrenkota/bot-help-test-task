import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { AsyncPipe, NgForOf, NgStyle } from '@angular/common';
import { LetDirective } from '../directives/ng-let.directive';
import {
  FixedSizeVirtualScrollStrategy,
  ScrollingModule
} from '@angular/cdk/scrolling';
import {
  VirtualScrollerComponent,
  VirtualScrollerModule
} from '@iharbeck/ngx-virtual-scroller';
import { numberToColor } from '../../utils';
import { take } from 'rxjs';
import { TAB_ID } from '../../tabId';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(50, 250, 500);
  }
}

@Component({
  selector: 'app-messages-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    LetDirective,
    ScrollingModule,
    VirtualScrollerModule,
    NgForOf,
    NgStyle,
    MatButton
  ],
  templateUrl: './messages-history.component.html',
  styleUrl: './messages-history.component.scss'
})
export class MessagesHistoryComponent implements AfterViewInit, OnInit {
  private destroyRef = inject(DestroyRef);

  private messagesService = inject(MessagesService);

  private tabId = inject(TAB_ID);

  messages$ = this.messagesService.messages$;

  @ViewChild(VirtualScrollerComponent)
  public virtualScroller?: VirtualScrollerComponent;

  public lastReadMessage: number | undefined;

  ngOnInit() {
    this.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(msgs => {
      if (msgs?.at(-1)?.sender === this.tabId) {
        this.lastReadMessage = msgs!.length;
        setTimeout(() =>
          this.virtualScroller?.scrollInto(msgs!.at(-1), undefined, 0, 0)
        );
      } else {
        const currentScrollPosition =
          this.virtualScroller?.viewPortInfo.scrollStartPosition;

        setTimeout(() => {
          if (currentScrollPosition) {
            this.virtualScroller?.scrollToPosition(currentScrollPosition, 0);
          }
        });
      }
    });
  }
  ngAfterViewInit() {
    if (this.virtualScroller) {
      this.scrollToBottom();
    }

    this.virtualScroller?.vsChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(v => {
        if (
          this.lastReadMessage === undefined ||
          this.lastReadMessage < v.endIndex
        ) {
          this.lastReadMessage = v.endIndex;
        }
      });
  }

  public scrollToBottom() {
    this.messages$.pipe(take(1)).subscribe(msgs => {
      this.virtualScroller?.scrollInto(msgs?.at(-1), undefined, 0, 0);
    });
  }

  protected readonly numberToColor = numberToColor;
}
