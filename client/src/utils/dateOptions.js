export const months = [
  { value: "01", id: "1", label: "January" },
  { value: "02", id: "2", label: "February" },
  { value: "03", id: "3", label: "March" },
  { value: "04", id: "4", label: "April" },
  { value: "05", id: "5", label: "May" },
  { value: "06", id: "6", label: "June" },
  { value: "07", id: "7", label: "July" },
  { value: "08", id: "8", label: "August" },
  { value: "09", id: "9", label: "September" },
  { value: "10", id: "10", label: "October" },
  { value: "11", id: "11", label: "November" },
  { value: "12", id: "12", label: "December" },
];

export const days = () => {
  const daysArray = [];
  for (let i = 1; i <= 31; i++) {
    let val = String(i);
    if (i < 10) {
      val = `0${val}`;
    }
    daysArray.push({ value: val, id: val, label: val });
  }
  return daysArray;
};

export const years = () => {
  const yearsArray = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 18; i >= currentYear - 100; i--) {
    const val = String(i);
    yearsArray.push({ value: val, id: val, label: val });
  }
  return yearsArray;
};
