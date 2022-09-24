/*eslint-disable*/
import React, { useEffect } from "react";
import Table from "./Paginated";
import { usePaginatedTable } from "./table-hook";
import Loader from "../../molecules/Loaders/LoaderWrapper";

const TableControls = ({
  rows: Rows,
  thead: Thead,
  query = "",
  payload,
  api,
}) => {
  const { tableData, loading, fetchTable, pagination } = usePaginatedTable({
    api,
    itemsPerPage: 15,
    payload: { page: 1, ...payload },
  });

  useEffect(() => {
    fetchTable({ search: query });
  }, [query]);

  return (
    <Loader loading={loading}>
      <Table
        rows={<Rows items={tableData?.items} />}
        thead={<Thead />}
        pagination={pagination}
        loading={loading}
      />
    </Loader>
  );
};

export default TableControls;
