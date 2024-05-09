import { InjectionToken } from '@angular/core';

const timestamp = Date.now() % (1000 * 60 * 60);

export const TAB_ID = new InjectionToken('Id of the current tab', {
  factory: () => timestamp
});
