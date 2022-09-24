import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

const SearchWrapper = styled.div`
  position: relative;

  button {
    position: absolute;
    z-index: 100;
    right: 0;
    top: 0;
    outline: none;
    height: 100%;
    width: 50px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    height: 20px;
    width: 20px;

    & svg {
      & path {
        fill: red;
      }
    }
  }

  input {
    position: relative;
    border: 1px solid #cbdae9;
    padding: 8px;
    padding-right: 30px;
    outline: none;
    border-radius: 8px;
    font-size: 14px;

    &::placeholder {
      color: var(--lightgray-200);
    }
  }
`;

// CREATES A URL SEARCH QUERY
const Search = ({ route = "" }: any) => {
  const history = useHistory();
  const location = useLocation();
  const searchString = location.search.replace("?query=", "") || "";
  const [query, setQuery] = useState(searchString);

  const onSubmit = () => {
    history.push(`${route}?query=${query}`);
  };

  const onChangeHandler = (e: any) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <SearchWrapper>
        <button type="submit" onClick={onSubmit}>
          <SearchIcon />
        </button>
        <input
          type="text"
          placeholder="Search"
          name="query"
          value={query}
          onChange={onChangeHandler}
        />
      </SearchWrapper>
    </div>
  );
};

export default Search;
