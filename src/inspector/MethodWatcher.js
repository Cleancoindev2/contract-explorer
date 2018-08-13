import MethodNode from './MethodNode';

export default class MethodWatcher {
  constructor(
    contract,
    method,
    args,
    smartContractService,
    parentContract = null
  ) {
    this._contract = contract;
    this._method = method;
    this._args = args;
    this._service = smartContractService;
    this._parentContract = parentContract;
  }

  id() {
    return `${this._contract}.${this._method}(${this._args.join(',')})`;
  }

  run() {
    try {
      const parentContract = this._getParentContract();
      return parentContract[this._method]
        .apply(parentContract[this._method], this._args)
        .then(value => [
          new MethodNode(
            this._method,
            this._args,
            this._contract,
            this.id(),
            value
          ),
          []
        ])
        .catch(reason => [
          new MethodNode(
            this._method,
            this._args,
            this._contract,
            this.id(),
            reason,
            true
          ),
          []
        ]);
    } catch (error) {
      return Promise.resolve([
        new MethodNode(
          this._method,
          this._args,
          this._contract,
          this.id(),
          error,
          true
        ),
        []
      ]);
    }
  }

  _getParentContract() {
    return (
      this._parentContract || this._service.getContractByName(this._contract)
    );
  }
}
