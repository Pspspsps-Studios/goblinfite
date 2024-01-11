export interface Action<TArgs = null, TReturn = null> {
  name: string;
  description: string;
  execute(TArgs): TReturn;
}
