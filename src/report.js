import React, { useState, useEffect } from "react";

const Report = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const queryReport = () => {
      window.gapi.client
        .request({
          path: "/v4/reports:batchGet",
          root: "https://analyticsreporting.googleapis.com/",
          method: "POST",
          body:
            {
              reportRequests:[
                {
                  viewId: "194051850",
                  "dateRanges":
                    [
                      {
                        "startDate": "2022-01-01",
                        "endDate": "2022-01-16"
                      }
                    ],
                  'metrics': [
                    {
                      'expression': 'ga:impressions'
                    },
                    {
                      'expression': 'ga:adclicks'
                    },
                    {
                      'expression': 'ga:ctr'
                    },
                    {
                      'expression': 'ga:cpc'
                    },
                    {
                      'expression': 'ga:adcost'
                    },
                    {
                      'expression': 'ga:goal4completions'
                    }
                  ],
                  'dimensions': [
                    {
                      "name": 'ga:adwordsCampaignId'
                    },
                    {
                      "name": 'ga:adwordsAdGroupId'
                    },
                    {
                      "name": 'ga:adwordsCreativeId'
                    },
                    {
                      "name": 'ga:keyword'
                    }
                  ],
                  "orderBys": [
                    {
                      "sortOrder": "DESCENDING",
                      "fieldName": "ga:impressions"
                    }
                  ]
                }
              ]
            },
        })
        .then(displayResults, console.error.bind(console));
    };

    const displayResults = (response) => {

      const queryResult = response.result.reports[0].data.rows;
      const result = queryResult.map((row) => {
        const keywordSting = row.dimensions;
        const keyword = `${keywordSting}`;

        row.metrics[0].values[2] = Math.round((row.metrics[0].values[2])*100)/100;
        row.metrics[0].values[3] = Math.round((row.metrics[0].values[3])*100)/100;
        row.metrics[0].values[4] = Math.round((row.metrics[0].values[4])*100)/100;

        let costPerConversion = row.metrics[0].values[4] / row.metrics[0].values[5];

        if ( isNaN(costPerConversion) || costPerConversion === Infinity )
        {
          costPerConversion = 0;
          row.metrics[0].values["6"] = row.metrics[0].values[5];
          row.metrics[0].values["5"] = costPerConversion;
        }
        else
        {
          costPerConversion = Math.round((row.metrics[0].values[4] / row.metrics[0].values[5])*100)/100;
          row.metrics[0].values["6"] = row.metrics[0].values[5];
          row.metrics[0].values["5"] = costPerConversion;
        }

        let values = [...row.dimensions, ...row.metrics[0].values];

        return {
          values,
        };
      });
      setData(result);
    };

    queryReport();
  }, []);

  return data.map((row, index) => (
    <div
      style={
        {
          paddingBottom: "7px",
          paddingTop: "7px",
          paddingLeft: '30px',
          display: 'flex',
          justifyContent: 'flex-start'
        }
      } key={row.values}> <b>{`${index+1}.- `} </b> {`${row.values.join(' - ')}`} </div>
  ));
};

export default Report;
