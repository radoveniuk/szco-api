import axios from 'axios';

const listRPO = async (search: string) => {
  try {
    const searchParam = !Number.isNaN(Number(search)) ? 'identifier' : 'fullName';

    const businesses = await axios
      .get(`https://api.statistics.sk/rpo/v1/search?${searchParam}=${search}&onlyActive=false`)
      .then(res => res.data?.results);

    return businesses.map((row: { addresses: any[]; fullNames: any[]; id: any; identifiers: { value: any; }[]; }) => {
      const addressObj = row.addresses[0];
      return {
        companyName: row.fullNames?.find(name => !name.validTo)?.value,
        name: row.fullNames?.find(name => !name.validTo)?.value,
        portalId: row.id,
        cin: row.identifiers[0].value,
        businessAddress: `${addressObj.street || ''} ${
          addressObj.regNumber && addressObj.buildingNumber
            ? `${addressObj.regNumber}/${addressObj.buildingNumber}`
            : addressObj.regNumber || addressObj.buildingNumber || ''
        }, ${addressObj.municipality ? addressObj.municipality.value || '' : ''}`
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default listRPO;
