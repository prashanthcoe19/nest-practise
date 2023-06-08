import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/**
 * unique validation arguments
 */
export interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    Model<E>,
    ((validationArguments: ValidationArguments) => Record<string, any>) | keyof E
  ];
}

/**
 * abstract class to validate unique
 */
@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel('YourMongooseModel') private readonly model: Model<any>) {}

  /**
   * validate method to validate provided condition
   * @param value
   * @param args
   */
  async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [model, findCondition = args.property] = args.constraints;
    const where = typeof findCondition === 'function' ? findCondition(args) : { [findCondition || args.property]: value };
    const count = await model.countDocuments(where);
    return count <= 0;
  }

  /**
   * default message
   * @param args
   */
  defaultMessage(args: ValidationArguments) {
    return `${args.property} '${args.value}' already exists`;
  }
}
