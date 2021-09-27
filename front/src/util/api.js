import { BASEURL } from '../Config';

export const postHeader = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const getAppointmentsUrl = (therapist, customer) =>
  `${BASEURL}/appointments/${therapist}/client/${customer}`;

export const getDecisionsUrl = id => `${BASEURL}/decision/therapist/${id}`;

export const getClientDecisionsUrl = (therapistId, clientId) =>
  `${BASEURL}/decision/therapist/${therapistId}/client/${clientId}`;

export const getPaymentUrl = id =>
  id ? `${BASEURL}/payment/${id}` : `${BASEURL}/payment`;

export const notificationsUrl = `${BASEURL}/notifications`;

export const getPaymentHistoryUrl = therapist =>
  therapist
    ? `${BASEURL}/paymenthistory/${therapist}`
    : `${BASEURL}/paymenthistory`;

export const getAllAppointmentsUrl = () => `${BASEURL}/appointments`;

export const getAllAppointments = async (clientId, therapistId, decisionId) => {
  console.log(clientId, therapistId, decisionId);
  const params = {
    clientId: clientId,
    therapistId: therapistId,
    decisionId: decisionId,
  };
  const query = getAllAppointmentsUrl() + '?' + queryParams(params);
  const response = await doGet(query);
  return await response.json();
};

const createParams = (clientId, therapistId, decisionId, state = undefined) => {
  const params = {
    clientId: clientId,
    therapistId: therapistId,
    decisionId: decisionId,
    state: state,
  };
  return params;
};

export const getReimbursed = async (clientId, therapistId, decisionId) => {
  console.log('getReimbursed');
  const params = createParams(
    clientId,
    therapistId,
    decisionId,
    'Reimburse_request',
  );
  //"Reimburse_request"
  //"Reimbursed"
  const query = getPaymentUrl() + '?' + queryParams(params);
  const resp = await doGet(query);
  return resp.json();
};

/**
 * Run a fetch to specific url.
 * @param {*} url
 */
export const doGet = async url => {
  let response = await fetch(url);
  return response;
};

export const doPut = async (url, options) => {
  let response = await fetch(url, {
    method: 'PUT',
    headers: options.headers,
    body: options.body,
  });
  return response;
};

export const doPost = async (url, options) => {
  let response = await fetch(url, {
    method: 'POST',
    headers: options.headers,
    body: options.body,
  });
  return response;
};

export const queryParams = params => {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
};
