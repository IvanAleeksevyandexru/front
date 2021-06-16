export interface AppRouterState {
  currentComponent: string;
}

/**
 * @property {some}[value] - здесь храним бизнес значения, будет использвовано для отправки в СМЭВ.
 * @property {some}[state] - здесь храним всё что касается состояния нашего приложения:
 *   фильтра, поиск, прочие настройки влияющие на состояние и отображение приложения.
 */
export interface AppState<T, U extends AppRouterState> {
  value: T;
  state: U;
}
