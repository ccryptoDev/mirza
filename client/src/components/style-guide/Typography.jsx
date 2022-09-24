import React from "react";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  TextXL,
  TextL,
  TextM,
  TextS,
  TextXS,
  TextXXS,
} from "../atoms/Typography";

const Guide = () => {
  return (
    <section>
      <H1>Super heading one (48px) H1</H1>
      <H2>Heading one (40px) H2</H2>
      <H3>Heading two (32px) H3</H3>
      <H4>Heading three (24px) H4</H4>
      <H5>Heading four (20px) H5</H5>
      <TextXL>
        Use for a short paragraph of introductory text to give particular
        impact. (20px){" "}
      </TextXL>
      <TextL>
        Use for a paragraph or two of intro text to give more prominence than
        body copy. (18px)
      </TextL>
      <TextM>
        Use for a short paragraph of introductory text to give particular
        impact. (16px){" "}
      </TextM>
      <TextS>
        Use for a short paragraph of introductory text to give particular
        impact. (14px){" "}
      </TextS>
      <TextXS>
        Use for a short paragraph of introductory text to give particular
        impact. (12px){" "}
      </TextXS>
      <TextXXS>
        Use for a short paragraph of introductory text to give particular
        impact. (10px){" "}
      </TextXXS>
    </section>
  );
};

export default Guide;
