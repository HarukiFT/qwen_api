import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MessageDto {
  @IsEnum(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

export class MessagesDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}

export class QwenCompletionDto {
  @IsBoolean()
  stream: boolean;

  @IsString()
  chat_type: string;

  @IsString()
  model: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}
