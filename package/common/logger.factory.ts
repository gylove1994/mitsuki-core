import { MitsukiApplication, MitsukiFactory } from './../core/mitsuki-factory';
import chalk from 'chalk';
import winston, { format } from 'winston';
import inquirer from 'inquirer';
export function mitsukiLoggerFactory(label?: string) {
  const logger = winston.createLogger({
    format: format.combine(
      format.colorize(),
      format.label({ label }),
      format.ms(),
      format.json(),
      format.printf(({ level, label, message, ms }) => {
        return `[${chalk.yellow('pid:' + process.pid)}] [${chalk.blue(label)}] [${level}] ${chalk.rgb(
          200,
          200,
          200,
        )(message)} ${chalk.yellowBright(ms)}`;
      }),
    ),
    transports: [new winston.transports.Console()],
  });
  return logger;
}
