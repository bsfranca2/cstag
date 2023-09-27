import styled from 'styled-components';

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  img {
    margin: 0 auto;
    height: 64px;
    width: auto;
  }
`;

export default function Logo() {
  return (
    <LogoWrapper>
      <img src="/img/logo.webp" alt="CStag logo" />
    </LogoWrapper>
  );
}
