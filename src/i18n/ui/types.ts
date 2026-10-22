import type { UiDict } from './en.ts';

/** A language file may leave out any key; missing keys fall back to English. */
export type DeepPartial<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type UiPartial = DeepPartial<UiDict>;
export type { UiDict };
