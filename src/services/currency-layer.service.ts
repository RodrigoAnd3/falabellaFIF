import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {CurrencyLayerDataSource} from '../datasources';

export interface CurrencyLayer {
  from: string;
  to: string;
}
export interface CurrencyServer {
  getdata(from: string, to: string): Promise<any>;
}
export class CurrencyLayerProvider implements Provider<CurrencyLayer> {
  constructor(
    // currencyLayer must match the name property in the datasource json file
    @inject('datasources.currencyLayer')
    protected dataSource: CurrencyLayerDataSource = new CurrencyLayerDataSource(),
  ) {}

  value(): Promise<CurrencyLayer> {
    return getService(this.dataSource);
  }
}
