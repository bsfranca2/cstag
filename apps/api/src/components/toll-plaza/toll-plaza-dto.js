export const toTollPlazaPeriodDTO = ({ idTollPlazaPeriod, ...period }) =>
  period;

export const toTollPlazaDTO = ({
  idTollPlaza,
  idTollPlazaPeriod,
  ...tollPlaza
}) => tollPlaza;
