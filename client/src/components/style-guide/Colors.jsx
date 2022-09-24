import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 20px;
    margin-bottom: 20px;

    .color {
      width: 100px;
      height: 40px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-shadow: 0 0 5px #fff;
    }
  }
`;

const gray = [
  { id: "gray-1", label: "gray-1", value: "var(--color-gray-1)" },
  { id: "gray-2", label: "gray-2", value: "var(--color-gray-2)" },
  { id: "gray-3", label: "gray-3", value: "var(--color-gray-3)" },
  { id: "gray-4", label: "gray-4", value: "var(--color-gray-4)" },
  { id: "gray-5", label: "gray-5", value: "var(--color-gray-5)" },
  { id: "gray-6", label: "gray-6", value: "var(--color-gray-6)" },
];

const orange = [
  { id: "orange-1", label: "orange-1", value: "var(--color-orange-1)" },
  { id: "orange-2", label: "orange-2", value: "var(--color-orange-2)" },
  { id: "orange-3", label: "orange-3", value: "var(--color-orange-3)" },
  { id: "orange-4", label: "orange-4", value: "var(--color-orange-4)" },
];

const purple = [
  { id: "purple-1", label: "purple-1", value: "var(--color-purple-1)" },
  { id: "purple-2", label: "purple-2", value: "var(--color-purple-2)" },
  { id: "purple-3", label: "purple-3", value: "var(--color-purple-3)" },
  { id: "purple-4", label: "purple-4", value: "var(--color-purple-4)" },
  { id: "purple-5", label: "purple-5", value: "var(--color-purple-5)" },
];

const green = [
  { id: "green-1", label: "green-1", value: "var(--color-green-1)" },
  { id: "green-2", label: "green-2", value: "var(--color-green-2)" },
  { id: "green-3", label: "green-3", value: "var(--color-green-3)" },
  { id: "green-4", label: "green-4", value: "var(--color-green-4)" },
  { id: "green-5", label: "green-5", value: "var(--color-green-5)" },
  { id: "green-6", label: "green-6", value: "var(--color-green-6)" },
];

const Color = ({ label, value }) => {
  return (
    <div className="color" style={{ background: value }}>
      {label}
    </div>
  );
};

const Colors = () => {
  return (
    <Wrapper>
      <section>
        {gray.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {green.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {purple.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
      <section>
        {orange.map((item) => (
          <Color key={item.id} {...item} />
        ))}
      </section>
    </Wrapper>
  );
};

export default Colors;
