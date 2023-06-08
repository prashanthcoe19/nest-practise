import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
    UnprocessableEntityException
  } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any>{
    async transform(value: any, metadata: ArgumentMetadata) {
        if(metadata.type === 'body'){
            const classType = metadata.metatype;
            const transformedObject = plainToClass(classType,value);
            const errors = await validate(transformedObject);
            if(errors.length){
                const translatedError = await this.transformError(errors);
                throw new BadRequestException(translatedError);
            }
            return transformedObject;
        }
        return value;
    }
    async transformError(errors: ValidationError[]) {
        const data = [];
        for (const error of errors) {
          data.push({
            property: error.property,
            constraints: error.constraints
          });
        }
        return data;
      }  
} 