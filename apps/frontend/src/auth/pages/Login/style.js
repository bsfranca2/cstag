import styled from 'styled-components';

const Background = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  padding-top: 2.25rem;
  background-image: url('/img/login_background.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #001529;
  opacity: 0.95;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 480px;
  z-index: 1;
`;

export const Container = ({ children }) => {
  return (
    <Background>
      <Content>{children}</Content>
      <Overlay />
    </Background>
  );
};

export const FormContainer = styled.div`
  width: 100%;
  padding: 2rem 2rem 1rem;
  border-radius: 3px;
  background-color: white;
`;

export const Logo = () => (
  <img
    src="/img/logo.webp"
    alt="CStag logo"
    style={{ height: 100, marginBottom: 24, pointerEvents: 'none' }}
  />
);
