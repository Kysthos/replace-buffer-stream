module.exports = [
  {
    comment: "should handle empty arguments",
    inputValue: "",
    searchValue: "",
    replaceValue: "",
  },
  {
    comment: "should handle empty input",
    inputValue: "",
    searchValue: "la",
    replaceValue: "POPOP",
  },
  {
    comment: "should handle empty replaceValue",
    inputValue: "lalalalalalalala",
    searchValue: "la",
    replaceValue: "",
  },
  {
    comment: "should handle empty searchValue",
    inputValue: "lalalalalalalala",
    searchValue: "",
    replaceValue: "POPOP",
  },
  {
    comment: "should handle empty search and replace values",
    inputValue: "Bolalalalala",
    searchValue: "",
    replaceValue: "",
  },
  {
    comment: "should handle single letters",
    inputValue: "ZAZOLASClA ASADUlHAFS",
    searchValue: "l",
    replaceValue: "P",
  },
];
