import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  textColor: "#212529",
  backgroundColor: "#fff",
  captionClr: "#95a5a6",
};

export const darkTheme = {
  textColor: "#fff",
  backgroundColor: "#222",
  captionClr: "#888",
};

export const GlobalStyles = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.textColor};
    background-color: ${({ theme }) => theme.backgroundColor};
  }

  caption {
    color: ${({ theme }) => theme.captionClr};
  }

  .blockquote-footer {
    color: ${({ theme }) => theme.captionClr};
  }

  .table {
    color: ${({ theme }) => theme.textColor};
  }
`;
