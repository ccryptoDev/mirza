export const mockRequest = (data, time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });
};

// SERVER WORK MOCK
export const tableData = ({ start, end, items, search, status }) => {
  const updatedItems = items
    .filter((item) =>
      search?.phoneNumber ? item.phoneNumber === search.phoneNumber : item
    )
    .filter((item) => (search?.status ? item.status === status : item));
  const total = updatedItems.length;
  const rows = updatedItems.slice(start, end);
  return {
    rows,
    total,
  };
};

// CLIENT API MOCK REQUEST
export const fetchTable = async ({
  skip,
  perPage,
  search = "",
  status = "",
  mockRows,
}) => {
  const start = skip;
  const end = skip + perPage;
  const result = await mockRequest(
    tableData({ start, end, items: mockRows, search, status })
  );
  const response = {
    data: {
      rows: result.rows,
      total: result.total,
    },
  };
  return response;
};
