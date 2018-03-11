import util = require('util')

export class KnapsackProLogger {
  // TODO use types from axios instead of any
  public logResponse(response: any) {
    console.log(util.inspect(response.data, {
      showHidden: false,
      depth: null
    }));
  }

  // TODO use types from axios instead of any
  public logError(error: any) {
    this.logResponse(error.response);
  }
}
