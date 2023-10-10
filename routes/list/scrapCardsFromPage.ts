const scrapCardsFromPage = () => {
  const szcoCards = document.querySelectorAll('.idsk-card');
  const result = Array.from(szcoCards).map((htmlCard) => {
    const [companyNameLink, ico, municipality, address] = Array.from(htmlCard.children);
    const companyNameSplited = companyNameLink.textContent?.split('-');
    companyNameSplited?.pop();

    const portalUrlSplitted = companyNameLink.children[0].getAttribute('href')?.split('/');
    return {
      portalId: portalUrlSplitted?.[portalUrlSplitted?.length - 1],
      name: companyNameSplited?.[0]?.trim() || companyNameLink.textContent,
      companyName: companyNameLink.textContent,
      cin: ico?.textContent?.replace('IČO ', ''),
      businessAddress: `${address.textContent}, ${municipality.textContent}`
    };
  });
  console.log(result);
  return result;
};

export default scrapCardsFromPage;
