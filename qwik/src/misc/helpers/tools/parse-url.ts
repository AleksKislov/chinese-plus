/**
 * @description - checks if given string is url, if true - return URL object
 */
export const parseURL = (str: string): URL | undefined => {
  try {
    return new URL(addProtocolIfNeeded(str));
  } catch (err) {
    // TODO add notifications
    console.log(err);
  }
};

function addProtocolIfNeeded(str: string) {
  if (str.includes("http://") || str.includes("https://")) {
    return str;
  } else {
    return "http://" + str;
  }
}
