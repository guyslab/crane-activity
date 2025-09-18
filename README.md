# crane-activity

## Design & Tech decisions
1. Native web components are leveraged for UI encapsulation and organization, while keeping simplicity of vanila/non-frameworks dependency.
2. NodeJS & Express.JS are choosen for my skill set. While it makes sense to use Node as an api/presentation level, it might not fit the logical calculations introduced while generating the report.
3. Most of the aggregation is done in the database, only top level summations are left to the web server.
4. The daily report data query encapsulate potentiall bad performance, although the date indexing is helpful. We can start with this online query (for time-to-market considerations, etc.). However, as the raw data set become more large at scale, I suggest to aggregare the report offline, with a map-reduce pattern. In such case the aggregated data shall reside in a document database.