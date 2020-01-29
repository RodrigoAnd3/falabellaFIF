import {DefaultCrudRepository} from '@loopback/repository';
import {Beeritem, BeeritemRelations} from '../models';
import {MysqlDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BeeritemRepository extends DefaultCrudRepository<
  Beeritem,
  typeof Beeritem.prototype.id,
  BeeritemRelations
> {
  constructor(@inject('datasources.mysqlDs') dataSource: MysqlDsDataSource) {
    super(Beeritem, dataSource);
  }
}
