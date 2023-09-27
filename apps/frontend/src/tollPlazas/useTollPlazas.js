import { message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import {
  fetchTollPlazasPeriods,
  importTollPlazaPeriod,
  updateTollPlazaPeriod,
  duplicateTollPlazaPeriod,
  fetchTollPlazaPeriod,
  fetchTollPlazas,
  updateTollPlaza,
  createTollPlaza,
} from './tollPlazasApi';
import { queryClient } from '../shared/queryClient';

const createDate = (date) => new Date(`${date}T00:00:00.000-03:00`);

export function useTollPlazasPeriods() {
  return useQuery('tollPlazasPeriods', fetchTollPlazasPeriods, {
    refetchOnWindowFocus: true,
  });
}

export function useImportTollPlazaSheet() {
  return useMutation(
    ({ sheet, period, description }) => {
      const formData = new FormData();
      formData.append('sheet', sheet.file);
      formData.append('startAt', createDate(period[0]).toISOString());
      formData.append('endAt', createDate(period[1]).toISOString());
      if (description) formData.append('description', description);
      return importTollPlazaPeriod(formData);
    },
    {
      onSuccess: () => {
        message.success('Planilha enviada com sucesso');
        queryClient.invalidateQueries('tollPlazasPeriods');
      },
    }
  );
}

export function useUpdateTollPlazaPeriod() {
  return useMutation(
    ({ period, active, ...rest }) =>
      updateTollPlazaPeriod({
        ...rest,
        startAt: createDate(period[0]),
        endAt: createDate(period[1]),
        inactived: !active,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tollPlazasPeriods');
        message.success('Período de praça atualizado com sucesso!');
      },
    }
  );
}

export function useDuplicateTollPlazaPeriod() {
  return useMutation(
    ({ period, active, ...rest }) => {
      return duplicateTollPlazaPeriod({
        ...rest,
        startAt: createDate(period[0]),
        endAt: createDate(period[1]),
        inactived: !active,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tollPlazasPeriods');
        message.success('Período de duplicado com sucesso!');
      },
    }
  );
}

export function useTollPlazaPeriod(id) {
  return useQuery(['tollPlazasPeriods', id], () => fetchTollPlazaPeriod(id));
}

export function useTollPlazas(
  { tollPlazaPeriodId, fullRoadName, pagination },
  onSuccess
) {
  return useQuery(
    ['tollPlazas', tollPlazaPeriodId, fullRoadName, JSON.stringify(pagination)],
    () => fetchTollPlazas({ tollPlazaPeriodId, fullRoadName, ...pagination }),
    { onSuccess }
  );
}

export function useUpdateTollPlaza() {
  return useMutation(updateTollPlaza, {
    onSuccess: () => {
      queryClient.invalidateQueries('tollPlazas');
      message.success('Praça atualizada com sucesso!');
    },
  });
}

export function useCreateTollPlaza() {
  return useMutation(createTollPlaza, {
    onSuccess: () => {
      queryClient.invalidateQueries('tollPlazas');
      message.success('Praça criada com sucesso!');
    },
  });
}
