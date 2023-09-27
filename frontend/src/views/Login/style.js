import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #efeeee;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 400px;
  border-radius: 10px;
  background: white;
  border: 1px #eaeaea solid;
  box-shadow: 0px 0px 25px #cac6c6;
  margin-bottom: 48px;
`;

export const Title = styled.div`
  color: #20a0ff;
  font-weight: bold;
  font-size: 40px;
  text-align: center;
  line-height: 2.2;
  font-family: sans-serif;
`;

export const InputGroup = styled.div`
  margin-top: 30px;
  width: 80%;
`;
