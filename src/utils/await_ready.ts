const DEFAULT_TIME_OUT = 2000; // 2s

type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;

type PromiseHandlers<T> = Array<{
  resolve: Resolve<T>,
  reject: Reject,
}>;

export interface IAwaitReady {
  isReady: boolean;
  awaitReady(): Promise<void>;
}

const WAIT_DID_TIMEOUT = 'Did time out';

export class AwaitReady implements IAwaitReady {
  protected _isReady = false;
  readonly #promiseHandlers: PromiseHandlers<void> = [];
  // @ts-ignore
  #waitingTimer: NodeJS.Timeout;
  // @ts-ignore
  #timeOutTimer: NodeJS.Timeout;
  #waitDidTimeout = false;

  constructor(private readonly timeOut = DEFAULT_TIME_OUT) {
  }

  readonly #onTimeout = () => {
    this.#waitDidTimeout = true;
    this.#timeOutTimer = undefined;
    this.#promiseHandlers.forEach(({reject}) => reject(WAIT_DID_TIMEOUT));
    this.#promiseHandlers.length = 0;
  }

  #waitTimeout = () => {
    if (this._isReady) {
      clearTimeout(this.#timeOutTimer);
      this.#timeOutTimer = undefined;
      this.#promiseHandlers.forEach(({resolve}) => resolve());
      this.#promiseHandlers.length = 0;
    }
    else {
      if (!this.#timeOutTimer) {
        this.#timeOutTimer = setTimeout(this.#onTimeout, this.timeOut);
      }
      // Keep polling while someone waits (none left after the time out)
      if (!this.#waitingTimer && this.#promiseHandlers.length) {
        this.#waitingTimer = setTimeout(this.#poll, 200);
      }
    }
  }

  readonly #poll = () => {
    this.#waitingTimer = undefined;
    this.#waitTimeout();
  }

  get isReady(): boolean {
    return this._isReady;
  }

  awaitReady(): Promise<void> {
    return (
      this.#waitDidTimeout ? Promise.reject(WAIT_DID_TIMEOUT) :
      this._isReady ? Promise.resolve() :
      new Promise<void>((resolve, reject) => {
        this.#promiseHandlers.push({resolve, reject});
        this.#waitTimeout();
      })
    );
  }
}
