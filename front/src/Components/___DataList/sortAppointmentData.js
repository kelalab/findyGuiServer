import moment from 'moment';
import dateToString from '../../helpers/dateToString';
import {groupBy, keys, path, prop, propEq, find} from 'ramda';

const getMonthYear = (data) => {
  const date = moment(data.therapySession.date, 'YYYY-MM-DD');
  return dateToString(date.month(), date.year());
};

const calculateAmount = (data, clients) => {
  //const grouped = groupBy(prop('clientId'))(data);
  const grouped = groupBy(path(['therapySession', 'decisionId']))(data);

  console.log('GROUPED', grouped);
  console.log('CLIENTS', clients);
  const _clients = keys(grouped);
  return _clients.map((item) => {
    const clientId = find(propEq('decisionId', item))(clients).id;
    let count = 0;
    const apts = grouped[item];
    apts.forEach((apt) => {
      count += apt.therapySession.sessionCount;
    });
    return {
      clientId: clientId,
      amount: count,
    };
  });
};

export default (data, clients) => {
  const richData = data.map((item) => ({
    ...item,
    month: getMonthYear(item),
  }));
  const grouped = groupBy(prop('month'))(richData);
  const months = keys(grouped);
  return months.map((item) => ({
    title: item,
    data: calculateAmount(grouped[item], clients),
  }));
};
