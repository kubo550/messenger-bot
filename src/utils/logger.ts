export class Logger {

  public static info(message: string, ...optionalParams: any[]): void {
    this.log('info', message, ...optionalParams);
  }

  public static success(message: string, ...optionalParams: any[]): void {
    this.log('success', message, ...optionalParams);
  }

  public static warn(message: string, ...optionalParams: any[]): void {
    this.log('warn', message, ...optionalParams);
  }

  public static error(message: string, ...optionalParams: any[]): void {
    this.log('error', message, ...optionalParams);
  }

  public static debug(message: string, ...optionalParams: any[]): void {
    this.log('debug', message, ...optionalParams);
  }

  public static trace(message: string, ...optionalParams: any[]): void {
    this.log('trace', message, ...optionalParams);
  }

  private static log(level: keyof typeof Logger, message: string, ...optionalParams: any[]): void {
    console.log(this.getColor(level), `[${level.toUpperCase()}] ${message}`, typeof optionalParams === 'object' ? JSON.stringify(optionalParams, null, 2) : optionalParams);
  }


  private static getColor(level: keyof typeof Logger): string {
    const colors: { [key: string]: string } = {
      info: '\x1b[36m%s\x1b[0m',
      success: '\x1b[32m%s\x1b[0m',
      warn: '\x1b[33m%s\x1b[0m',
      error: '\x1b[31m%s\x1b[0m',
      debug: '\x1b[37m%s\x1b[0m',
      trace: '\x1b[37m%s\x1b[0m',
    };
    return colors[level];
  }

}


