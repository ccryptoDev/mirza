import React from "react";
import styled from "styled-components";
import { TextS as Text } from "../../../atoms/Typography";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--color-gray-2);
  border-left: 4px solid var(--color-green-3);
`;

const Note = () => {
  return (
    <Wrapper>
      <Text>
        <b>Don’t know how much to finance?</b>
      </Text>
      <Text>
        Your employer offers loans of up to $15,000. Depending on your care
        costs and other debt you have, you may want to take out less than that
        to support your family.{" "}
      </Text>
    </Wrapper>
  );
};

export default Note;
