import util = require('util');
import {
  AxiosError,
  AxiosResponse
} from 'axios';

export class KnapsackProLogger {
  public logResponse(response: AxiosResponse<any>) {
    console.log(util.inspect(response.data, {
      showHidden: false,
      depth: null
    }));
  }

  public logError(error: AxiosError) {
    this.logResponse(error.response);
  }
}
