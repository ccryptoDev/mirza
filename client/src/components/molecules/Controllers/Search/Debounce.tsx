import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as SearchIcon } from "./search.svg";
import TextField from "../TextField";

const Wrapper = styled.div`
  position: relative;

  input {
    padding-left: 40px;
  }

  .search-icon {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    z-index: 100;
    pointer-events: none;
    height: 13px;
    width: 13px;
  }
`;

// DELAYED SEARCH
const Search = ({ searchHandler }: any) => {
  const [input, setInput] = useState("");

  // input search debounce
  useEffect(() => {
    const debounce = setTimeout(() => {
      searchHandler(input);
    }, 1000);
    return () => {
      clearInterval(debounce);
    };
    // eslint-disable-next-line
  }, [input]);

  const onChangeHandler = (e: any) => setInput(e.target.value);

  return (
    <div>
      <Wrapper>
        <div className="search-icon">
          <SearchIcon />
        </div>
        <TextField
          onChange={onChangeHandler}
          value={input}
          placeholder="Search"
        />
      </Wrapper>
    </div>
  );
};

export default Search;
