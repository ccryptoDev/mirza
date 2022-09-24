import React from "react";
import Pagination from "./Logic";

const Wrapper = ({ data: { numberOfItems, itemsPerPage }, getPageNumber }) => {
  return (
    <div>
      <div className="container">
        <div className="text-center">
          {numberOfItems ? (
            <Pagination
              numberOfItems={numberOfItems}
              onChangePage={getPageNumber}
              pageSize={itemsPerPage}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
