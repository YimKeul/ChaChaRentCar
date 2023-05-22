import styled from "styled-components";

const Cfonts = styled.div`
  font-weight: 600;
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color || "black"};
`;
export default Cfonts;
