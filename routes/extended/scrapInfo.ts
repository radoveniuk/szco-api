export const scrapInfo = () => {
  const RowTitles = {
    companyName: 'Obchodné meno',
    cin: 'IČO',
    businessAddressForeign: 'Adresa miesta činnosti podniku zahraničnej osoby',
    businessAddressSk: 'Miesto podnikania',
    address: 'Vedúci podniku zahraničnej osoby'
  };
  const allInfoRows = Array.from(document.querySelectorAll('.govuk-grid-column-full'));
  const findInfo = (key: keyof typeof RowTitles) => {
    const findedElement = allInfoRows.find((el) => el?.textContent?.includes(RowTitles[key]));
    const findedElementValue = findedElement?.querySelector('.d-dd');
    // @ts-ignore
    return findedElementValue?.innerText;
  };
  const getActivities = () => {
    const listElements = Array.from(document.querySelector('ol.govuk-list')?.children || []);
    const result = listElements.map((el) => {
      const dateFrom = el.children[1]?.children[1]?.textContent;
      const dateTo = el.children[2]?.children[1]?.textContent;

      function convertToISODate (dateString: string) {
        const parts = dateString.split('.');
        if (parts.length !== 3) {
          throw new Error('Некорректный формат даты. Ожидается формат dd.MM.yyyy');
        }

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        if (!isValidDate(day, month, year)) {
          throw new Error('Некорректная дата.');
        }

        return `${year}-${month}-${day}`;
      }

      function isValidDate (day: string, month: string, year: string) {
        const parsedDay = parseInt(day, 10);
        const parsedMonth = parseInt(month, 10);
        const parsedYear = parseInt(year, 10);

        if (
          isNaN(parsedDay) ||
          isNaN(parsedMonth) ||
          isNaN(parsedYear) ||
          parsedMonth < 1 ||
          parsedMonth > 12 ||
          parsedDay < 1 ||
          parsedDay > 31 ||
          parsedYear < 1
        ) {
          return false;
        }

        // Проверка на февраль и количество дней в месяце
        if (parsedMonth === 2) {
          if ((parsedYear % 4 === 0 && parsedYear % 100 !== 0) || parsedYear % 400 === 0) {
            return parsedDay <= 29;
          } else {
            return parsedDay <= 28;
          }
        }

        // Проверка на месяцы с 30 днями
        if ([4, 6, 9, 11].includes(parsedMonth)) {
          return parsedDay <= 30;
        }

        return true;
      }

      return {
        // @ts-ignore
        description: el.children[0]?.innerText.trim(),
        effective_from: convertToISODate(dateFrom as string),
        effective_to: dateTo ? convertToISODate(dateTo as string) : null,
        status: dateTo ? 'closed' : 'open'
      };
    });
    return result;
  };
  const activities = getActivities();
  const getStatus = () => {
    let result = 'active';
    const maybeTerminationMessage = Array.from(document.querySelectorAll('p.vypis'));
    const isClosed = maybeTerminationMessage.some((el) => el.textContent?.includes('ukončil podnikateľskú činnosť'));
    if (activities.every((el) => el.effective_to) && !isClosed) {
      result = 'stopped';
    }
    if (isClosed) {
      result = 'closed';
    }
    return result;
  };
  return {
    companyName: findInfo('companyName'),
    cin: findInfo('cin'),
    name: findInfo('address')?.split('\n')?.[0] || findInfo('companyName'),
    address: findInfo('address')?.split('\n')?.[1],
    businessAddress: findInfo('businessAddressForeign') || findInfo('businessAddressSk'),
    status: getStatus(),
    activities,
    isSlovak: !findInfo('businessAddressForeign'),
    type: 'individual'
  };
};