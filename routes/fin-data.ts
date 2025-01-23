import axios from 'axios';

const finData = async (ico: string) => {
  const baseUrl = 'https://iz.opendata.financnasprava.sk/api/data/';
  const slug = 'ds_dphs/search';
  const url = baseUrl + slug;

  const params = {
    page: 1,
    column: 'ico',
    search: ico
  };

  const headers = {
    accept: 'application/json',
    key: 'ocXNnDN0FDdwWKuVB46OSHw1MEe6Wga8PLMIzd8ZGri7AobdXwdK3WraVz4xaw57kqOr3CuUyt0LvMggUCHQ7KEOecBxXHTE4DteWyQFi8MsTF2Fdx5gXeTbkm5FEr3CHpao6AQqAdb9BulVABzSDqQqSRs527USspcmxLteeJVn3KCnADsae8StuBP5cTwpQExP0JOeQFcGWvrDVZAyR2N6qtts3mDA7CnTNX9bljF0SO6oXsjG4ZNrfh'
  };

  const financeDataDph = await axios({ method: 'GET', url, params, headers }).catch(() => {
    return null;
  });

  return financeDataDph?.data.data[0];
};

export default finData;
