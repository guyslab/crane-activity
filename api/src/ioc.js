class Container {
  constructor() {
    this.services = new Map();
  }

  register(name, factory) {
    this.services.set(name, factory);
  }

  resolve(name) {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory();
  }
}

const container = new Container();

// Register data queries
const DailyCraneActivityDataQuery = require('./data/DailyCraneActivityDataQuery');
const AvailableCraneDatesDataQuery = require('./data/AvailableCraneDatesDataQuery');

container.register('DailyCraneActivityDataQuery', () => new DailyCraneActivityDataQuery());
container.register('AvailableCraneDatesDataQuery', () => new AvailableCraneDatesDataQuery());

// Register business services
const GetDailyCraneReport = require('./business/GetDailyCraneReport');
const GetAvailableDates = require('./business/GetAvailableDates');

container.register('GetDailyCraneReport', () => new GetDailyCraneReport(container.resolve('DailyCraneActivityDataQuery')));
container.register('GetAvailableDates', () => new GetAvailableDates(container.resolve('AvailableCraneDatesDataQuery')));

// Register controllers
const ReportController = require('./controllers/ReportController');
const ScopeController = require('./controllers/ScopeController');

container.register('ReportController', () => new ReportController(container.resolve('GetDailyCraneReport')));
container.register('ScopeController', () => new ScopeController(container.resolve('GetAvailableDates')));

module.exports = container;