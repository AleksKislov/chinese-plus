/** An error with an HTTP status: apiDecorator answers it with `{ msg }` instead of a 500. */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = { HttpError };
