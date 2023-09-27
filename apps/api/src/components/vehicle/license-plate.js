export const LicensePlate = {
  isValid(placa) {
    const regexPlaca = /^[A-Za-z]{3}\d{4}$/;
    const regexPlacaMercosulCarro = /^[A-Za-z]{3}\d[A-Za-z]\d{2}$/;
    const regexPlacaMercosulMoto = /^[A-Za-z]{3}\d{2}[A-Za-z]\d$/;
    if (
      regexPlaca.test(placa) ||
      regexPlacaMercosulCarro.test(placa) ||
      regexPlacaMercosulMoto.test(placa)
    ) {
      return true;
    }
    return false;
  },
};
