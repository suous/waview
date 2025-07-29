/** @format */

import * as React from 'react';
import { ViewActionType } from '@/types/view';
import { ModelActionType } from '@/types/model';

export function useActionCreator<ActionType extends ViewActionType | ModelActionType>(dispatch: React.Dispatch<ActionType>) {
  return React.useCallback(
    <T extends ActionType['type']>(type: T) =>
      (payload: Extract<ActionType, { type: T }>['payload']) =>
        dispatch({ type, payload } as ActionType),
    [dispatch]
  );
}
