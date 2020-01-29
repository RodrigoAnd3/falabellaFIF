import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Beeritem} from '../models';
import {BeeritemRepository} from '../repositories';
import {inject} from '@loopback/core';
import {CurrencyServer} from '../services';

export class BeerController {
  constructor(
    @repository(BeeritemRepository)
    public beeritemRepository: BeeritemRepository,
    @inject('services.CurrencyLayer') protected currencyService: CurrencyServer,
  ) {}

  @post('/beer', {
    responses: {
      '200': {
        description: 'Beeritem model instance',
        content: {'application/json': {schema: getModelSchemaRef(Beeritem)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beeritem, {
            title: 'NewBeeritem',
          }),
        },
      },
    })
    beeritem: Beeritem,
  ): Promise<Beeritem> {
    return this.beeritemRepository.create(beeritem);
  }

  @get('/beer/count', {
    responses: {
      '200': {
        description: 'Beeritem model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Beeritem))
    where?: Where<Beeritem>,
  ): Promise<Count> {
    return this.beeritemRepository.count(where);
  }

  @get('/beer', {
    responses: {
      '200': {
        description: 'Array of Beeritem model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Beeritem, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Beeritem))
    filter?: Filter<Beeritem>,
  ): Promise<Beeritem[]> {
    return this.beeritemRepository.find(filter);
  }

  @patch('/beer', {
    responses: {
      '200': {
        description: 'Beeritem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beeritem, {partial: true}),
        },
      },
    })
    beeritem: Beeritem,
    @param.query.object('where', getWhereSchemaFor(Beeritem))
    where?: Where<Beeritem>,
  ): Promise<Count> {
    return this.beeritemRepository.updateAll(beeritem, where);
  }

  @get('/beer/{id}', {
    responses: {
      '200': {
        description: 'Beeritem model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Beeritem, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Beeritem))
    filter?: Filter<Beeritem>,
  ): Promise<Beeritem> {
    return this.beeritemRepository.findById(id, filter);
  }

  @get('/exchange-rate/{from}/{to}')
  getall(
    @param.path.string('from') from: string,
    @param.path.string('to') to: string,
  ) {
    return this.currencyService.getdata(from, to);
  }

  @get('/beer/{id}/boxprice/{newCurrency}', {
    responses: {
      '200': {
        description: 'Beeritem model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Beeritem, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findByIdandTransformCurrency(
    @param.path.number('id') id: number,
    @param.path.string('newCurrency') newCurrency: string,
    @param.query.object('filter', getFilterSchemaFor(Beeritem))
    filter?: Filter<Beeritem>,
  ) {
    const getPrice = this.beeritemRepository.findById(id, filter);
    (await getPrice).newCurrency = newCurrency;
    const quantityPerBox = 6;
    const currency = (await getPrice).currency;
    await this.currencyService
      .getdata(currency, newCurrency)
      .then(async response => {
        (await getPrice).totalPrice =
          response[`${currency}_${newCurrency}`.toUpperCase()] * quantityPerBox;
      });
    return getPrice;
  }

  @patch('/beer/{id}', {
    responses: {
      '204': {
        description: 'Beeritem PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beeritem, {partial: true}),
        },
      },
    })
    beeritem: Beeritem,
  ): Promise<void> {
    await this.beeritemRepository.updateById(id, beeritem);
  }

  @put('/beer/{id}', {
    responses: {
      '204': {
        description: 'Beeritem PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() beeritem: Beeritem,
  ): Promise<void> {
    await this.beeritemRepository.replaceById(id, beeritem);
  }

  @del('/beer/{id}', {
    responses: {
      '204': {
        description: 'Beeritem DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.beeritemRepository.deleteById(id);
  }
}
