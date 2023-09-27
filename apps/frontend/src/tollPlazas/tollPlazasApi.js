import { request } from '../shared/request';

export const fetchTollPlazasPeriods = () =>
  request.get('/tollPlazasPeriods').then((res) => res.data);

export const importTollPlazaPeriod = (data) =>
  request
    .post('/tollPlazasPeriods/import', data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);

export const updateTollPlazaPeriod = ({ tollPlazaPeriodId, ...data }) =>
  request
    .patch(`/tollPlazasPeriods/${tollPlazaPeriodId}`, data)
    .then((res) => res.data);

export const duplicateTollPlazaPeriod = ({ tollPlazaPeriodId, ...data }) =>
  request
    .post(`/tollPlazasPeriods/${tollPlazaPeriodId}/duplicate`, data)
    .then((res) => res.data);

export const fetchTollPlazaPeriod = (tollPlazaPeriodId) =>
  request
    .get(`/tollPlazasPeriods/${tollPlazaPeriodId}`)
    .then((res) => res.data);

export const fetchTollPlazas = (params) =>
  request.get(`/tollPlazas`, { params }).then((res) => res.data);

export const updateTollPlaza = ({ tollPlazaId, ...data }) =>
  request.patch(`/tollPlazas/${tollPlazaId}`, data).then((res) => res.data);

export const createTollPlaza = (data) =>
  request.post('/tollPlazas', data).then((res) => res.data);
