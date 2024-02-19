import axios from 'axios';

const extendedRPO = async (id: string) => {
  const result = await axios.get(`https://api.statistics.sk/rpo/v1/entity/${id}?showHistoricalData=true`).then(res => res.data);
  const cin = result.identifiers[0]?.value;

  const financialData = await axios({
    method: 'GET',
    url: 'https://iz.opendata.financnasprava.sk/api/data/ds_dsrdp/search',
    params: {
      page: 1,
      column: 'ico',
      search: cin
    },
    headers: {
      accept: 'application/json',
      key: 'ocXNnDN0FDdwWKuVB46OSHw1MEe6Wga8PLMIzd8ZGri7AobdXwdK3WraVz4xaw57kqOr3CuUyt0LvMggUCHQ7KEOecBxXHTE4DteWyQFi8MsTF2Fdx5gXeTbkm5FEr3CHpao6AQqAdb9BulVABzSDqQqSRs527USspcmxLteeJVn3KCnADsae8StuBP5cTwpQExP0JOeQFcGWvrDVZAyR2N6qtts3mDA7CnTNX9bljF0SO6oXsjG4ZNrfh'
    }
  })
    .then(res => res.data.data?.[0])
    .catch(() => ({ dic: '' }));

  const addressObj = result.addresses[0];
  const statutoryBodyAddressObj = result?.statutoryBodies?.[0]?.address;

  const createAddress = (values: any) =>
    values
      ? `${values.postalCodes?.[0] || ''} ${values.street || ''} ${
            values.regNumber && values.buildingNumber
              ? `${values.regNumber}/${values.buildingNumber}`
              : values.regNumber || values.buildingNumber || ''
          }, ${values.municipality ? values.municipality.value || '' : ''}`.trim()
      : '';

  const getStatus = () => {
    if (result.activities.every((item: { suspendedFrom: any; suspendedTo: any; }) => item.suspendedFrom && item.suspendedTo)) {
      return 'stopped';
    }
    return !result.termination ? 'active' : 'closed';
  };

  return {
    companyName: result.fullNames?.[result.fullNames.length - 1]?.value,
    name: result.fullNames?.[result.fullNames.length - 1]?.value,
    portalId: result.id,
    cin,
    businessAddress: createAddress(addressObj),
    DIC: financialData.dic,
    activities: result.activities.map((item: { economicActivityDescription: any; validFrom: any; validTo: any; }) => ({
      description: item.economicActivityDescription,
      effective_from: item.validFrom,
      effective_to: item.validTo,
      status: item.validTo ? 'closed' : 'open'
    })),
    register: result.sourceRegister.registrationOffices?.[0]?.value,
    registerNumber: result.sourceRegister.registrationNumbers?.[0]?.value,
    address: createAddress(statutoryBodyAddressObj),
    status: getStatus(),
    isSlovak: !statutoryBodyAddressObj || statutoryBodyAddressObj?.country?.code === '703'
  };
};

export default extendedRPO;
