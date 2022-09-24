import styled, { css } from "styled-components";

// table wrapper, table and the table content structure
const table = css`
  position: relative;

  table {
    border-collapse: separate;
    border-spacing: 0;
    box-sizing: border-box;
    font-size: 14px;
    width: 100%;
    /* min-width: 1400px; */
    background: #fff;
  }

  .noTable {
    font-size: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    position: relative;
  }
`;

const classicTable = css`
  th,
  td {
    text-align: left;
  }

  tbody tr {
    border-top: 1px solid #ccc;
    &:nth-child(odd) {
      background: #fafafc;
    }
  }
`;

const roundedTable = css`
  padding: 0 10px 10px 0;
  table {
    & td,
    & th {
      border: 1px solid #ccc;
      border-style: none solid solid none;
    }

    & th {
      font-weight: 600;
    }

    & tr th:first-child {
      padding-left: 15px;
    }

    & tr td:first-child div a {
      color: rgb(15, 139, 225);
      font-weight: bold;
      text-decoration: none;
    }

    & tr:first-child td:first-child {
      border-top-left-radius: 10px;
    }
    & tr:first-child td:last-child {
      border-top-right-radius: 10px;
    }
    & tr:last-child td:first-child {
      border-bottom-left-radius: 10px;
    }
    & tr:last-child td:last-child {
      border-bottom-right-radius: 10px;
    }
    & tr:first-child td {
      border-top-style: solid;
    }
    & tr td:first-child {
      border-left-style: solid;
    }

    & tr:last-child td:first-child {
      border-bottom-left-radius: 10px;
    }

    & th {
      border: none;
      color: #1a3855;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      font-size: 13px;
      padding: 5px;
      text-transform: uppercase;
      text-align: left;
    }

    & tbody {
      border-radius: 10px;
      box-shadow: 4px 5px 9px rgba(0, 47, 94, 0.11);
    }

    & tbody tr {
      :nth-of-type(even) {
        background-color: #f3faff;
      }

      :nth-of-type(odd) {
        background-color: #fff;
      }
    }
  }
`;

export const smallBordersTd = css`
  height: 1px;
  padding: 12px 0;
  font-family: EuclidCircular;
  box-sizing: border-box;
  color: var(--color-gray-2);

  &.break {
    word-break: break-all;
  }

  & .cell {
    padding: 0 12px;
    height: 100%;
  }

  & .border {
    border-left: 1px solid var(--color-gray-3);
  }
`;

export const ClassicTable = styled.div`
  ${table}
  ${classicTable}
`;

export const RoundedTable = styled.div`
  ${table}
  ${roundedTable}
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pagesCounter {
    padding: 10px;
  }
`;

export const Cell = styled.div`
  padding: 14px;
  .agent-view-button {
    text-transform: unset;
  }
`;
