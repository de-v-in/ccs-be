import chalk from "chalk";

import { LOG_DEFAULT_CONF } from "@constants/log";

type ChalkInstance = typeof chalk.bold;

const LOG = console.log;

type TFallback = <T = {}>(data: {
  fnName: string;
  fnMessage: string;
  fnData: T;
}) => void;

/**
 * Simple log class for better log filter
 */
class Logger {
  name: string;
  fallback: TFallback | null;
  activated: boolean;
  config = LOG_DEFAULT_CONF;

  constructor(name: string, activated = true) {
    this.name = name;
    this.activated = activated;
    this.fallback = null;
    return this;
  }

  // Set fallback when bug happen
  setBugFallback(cb: TFallback) {
    this.fallback = cb;
    return this;
  }

  /**
   * Print with color in console
   */
  private builder(
    background?: string,
    color = "white",
    bold = false
  ): ChalkInstance {
    let builder: ChalkInstance = chalk;
    if (color) {
      builder = builder.hex(color);
    }
    if (background) {
      builder = builder.bgHex(background);
    }
    if (bold) {
      return builder.bold;
    }
    return builder;
  }

  /**
   * Print and info with custom color
   */
  print(
    msg: string,
    opts?: { background: string; color: string; bold: boolean }
  ): void {
    let { background, color, bold } = opts;
    let builder: ChalkInstance = this.builder(background, color, bold);
    LOG(builder(msg));
  }

  private log<T = {}>(
    tag: keyof typeof LOG_DEFAULT_CONF.TAG,
    fnName: string,
    fnMessage: string,
    fnData?: T
  ): void {
    if (this.activated) {
      const { color, label } = this.config.TAG[tag];
      const lBuilder = this.builder(color, "#ffffff", true);
      const timeBuilder = this.builder("#ffffff", "#333333", false);
      const nBuilder = this.builder(null, this.config.TARGET_COLOR, false);
      const fnNameBuilder = this.builder(null, this.config.FUNCT_COLOR, true);
      const fnMessBuilder = this.builder(null, this.config.MESS_COLOR);
      LOG(
        `<${lBuilder(label)} ${timeBuilder(
          new Date().toTimeString().slice(0, 8)
        )} #${nBuilder(this.name)}> ${fnNameBuilder(fnName)}: ${fnMessBuilder(
          fnMessage
        )}`,
        fnData || ""
      );
    }
    if (tag === "bug") {
      this.fallback?.({
        fnName,
        fnMessage,
        fnData,
      });
    }
  }

  /**
   * Info log, use for logging info, data and api
   */
  i<T = {}>(fnName: string, fnMessage: string, fnData?: T) {
    this.log("info", fnName, fnMessage, fnData);
    return this;
  }

  /**
   * Warning log, use for error that not affect user
   */
  w<T = {}>(fnName: string, fnMessage: string, fnData?: T) {
    this.log("warn", fnName, fnMessage, fnData);
    return this;
  }

  /**
   * Error log, use for critical log => will be tracked into server
   */
  b<T = {}>(fnName: string, fnMessage: string, fnData?: T) {
    this.log("bug", fnName, fnMessage, fnData);
    return this;
  }

  /**
   * Call when doing something before info
   */
  d<T = {}>(fnName: string, fnMessage: string, fnData?: T) {
    this.log("doin", fnName, fnMessage, fnData);
    return this;
  }

  /**
   * Route info
   */
  r<T = {}>(fnName: string, fnMessage: string, fnData?: T) {
    this.log("rote", fnName, fnMessage, fnData);
    return this;
  }
}

export { Logger };
