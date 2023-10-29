const { apiDecorator } = require("../../api-decorator");
const { resetPassword } = require("./reset-password");
const { sendResetPasswordEmail } = require("./send-reset-password-email");
const { verifyResetPassToken } = require("./verify-reset-pass-token");

module.exports = {
  resetPassword: apiDecorator(resetPassword),
  verifyResetPassToken: apiDecorator(verifyResetPassToken),
  sendResetPasswordEmail: apiDecorator(sendResetPasswordEmail),
};
