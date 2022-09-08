import { createParamDecorator, createParamInterceptor, Data } from '../core/decorator';
import { ParseCommandPipe, CommandArgsPipe } from './command.mipipe';

export const ParseCommand = () => Data(ParseCommandPipe);

export const CommandArgs = createParamInterceptor('[commandModule:commandArgs]', CommandArgsPipe);

export const CommandGroup = createParamDecorator('[CommandModule]command');

export const CommandOutput = createParamDecorator('[CommandModule]output');
