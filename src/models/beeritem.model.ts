import {Entity, model, property} from '@loopback/repository';
@model({settings: {strict: false}})
export class Beeritem extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  brewery?: string;

  @property({
    type: 'string',
    required: true,
  })
  country?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: 0;

  @property({
    type: 'string',
    required: true,
  })
  currency: string;

  @property({
    type: 'string',
  })
  newCurrency: string;

  @property({
    type: 'number',
  })
  totalPrice: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Beeritem>) {
    super(data);
  }
}

export interface BeeritemRelations {
  // describe navigational properties here
}

export type BeeritemWithRelations = Beeritem & BeeritemRelations;
