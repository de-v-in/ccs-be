import chalk from "chalk";
import { Inject, Logger } from "@tsed/common";

type ChalkInstance = typeof chalk.bold;

export class CLogger {
  @Inject()
  logger: Logger;

  name: string;
  classBuilder = this.builder(undefined, "#00C475", true);
  fnNameBuilder = this.builder(undefined, "#6b4bcc", true);
  fnMessBuilder = this.builder(undefined, "#ffffff", false);

  constructor(name?: string) {
    this.name = name || "default";
  }

  /**
   * Print with color in console
   */
  private builder(background?: string, color = "white", bold = false): ChalkInstance {
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

  info(fnName: string, fnMessage: string, ...data: any[]) {
    return this.logger.info(
      `${this.classBuilder(this.name)} > ${this.fnNameBuilder(fnName)} > ${this.fnMessBuilder(fnMessage)}`,
      data.length > 0 ? data : ""
    );
  }

  warn(fnName: string, fnMessage: string, ...data: any[]) {
    return this.logger.warn(
      `${this.classBuilder(this.name)} > ${this.fnNameBuilder(fnName)} > ${this.fnMessBuilder(fnMessage)}`,
      data.length > 0 ? data : ""
    );
  }

  error(fnName: string, fnMessage: string, ...data: any[]) {
    return this.logger.error(
      `${this.classBuilder(this.name)} > ${this.fnNameBuilder(fnName)} > ${this.fnMessBuilder(fnMessage)}`,
      data.length > 0 ? data : ""
    );
  }
}
