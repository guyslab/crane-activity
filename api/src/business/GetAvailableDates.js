class GetAvailableDates {
  constructor(availableCraneDatesDataQuery) {
    this.dataQuery = availableCraneDatesDataQuery;
  }

  async execute() {
    const dates = await this.dataQuery.execute();
    
    return {
      dates: dates
    };
  }
}

module.exports = GetAvailableDates;