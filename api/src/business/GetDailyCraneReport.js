class GetDailyCraneReport {
  constructor(dailyCraneActivityDataQuery) {
    this.dataQuery = dailyCraneActivityDataQuery;
  }

  async execute(date) {
    const report = await this.dataQuery.execute(date);
    
    if (!report) {
      return null;
    }

    return report;
  }
}

module.exports = GetDailyCraneReport;