const requiredMessage = (pronoun, label) =>
  `Por favor preencha ${pronoun} ${label}`;

const login = {
  tenant: [{ required: true, message: requiredMessage('o', 'tenant') }],
  username: [{ required: true, message: requiredMessage('o', 'usuário') }],
  password: [{ required: true, message: requiredMessage('a', 'senha') }],
};

[login].forEach((item) => {
  Object.defineProperty(item, 'required', { value: [{ required: true }] });
});

export default login;
