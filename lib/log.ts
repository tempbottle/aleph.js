import { blue, dim, green, red, yellow } from "https://deno.land/std@0.125.0/fmt/colors.ts";

export type LevelName = "debug" | "info" | "warn" | "error" | "fatal";

export enum Level {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Fatal = 4,
}

export class Timing {
  #t: number;

  constructor(quit?: boolean) {
    this.#t = !quit ? performance.now() : 0;
  }

  reset() {
    if (this.#t > 0) {
      this.#t = performance.now();
    }
  }

  stop(message: string) {
    if (this.#t > 0) {
      const now = performance.now();
      const d = Math.round(now - this.#t);
      let cf = green;
      if (d > 10000) {
        cf = red;
      } else if (d > 1000) {
        cf = yellow;
      }
      this.#t = now;
      console.debug(dim("TIMING"), message, "in", cf(d + "ms"));
    }
  }
}

export class Logger {
  #level: Level = Level.Info;

  get level(): Level {
    return this.#level;
  }

  setLevel(level: LevelName): void {
    switch (level) {
      case "debug":
        this.#level = Level.Debug;
        break;
      case "info":
        this.#level = Level.Info;
        break;
      case "warn":
        this.#level = Level.Warn;
        break;
      case "error":
        this.#level = Level.Error;
        break;
      case "fatal":
        this.#level = Level.Fatal;
        break;
    }
  }

  debug(...args: unknown[]): void {
    if (this.#level <= Level.Debug) {
      console.debug(dim("DEBUG"), ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.#level <= Level.Info) {
      console.log(green("INFO"), ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.#level <= Level.Warn) {
      console.warn(yellow("WARN"), ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.#level <= Level.Error) {
      console.error(red("ERROR"), ...args);
    }
  }

  fatal(...args: unknown[]): void {
    if (this.#level <= Level.Fatal) {
      console.error(red("FATAL"), ...args);
      Deno.exit(1);
    }
  }

  timing(): Timing {
    return new Timing(this.level > Level.Debug);
  }
}

// deno-lint-ignore ban-ts-comment
// @ts-ignore
const defaultLogger = window.__LOGGER || (window.__LOGGER = new Logger());
export default defaultLogger;
export { blue, dim, green, red, yellow };
