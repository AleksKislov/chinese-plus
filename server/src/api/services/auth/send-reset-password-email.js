const postmark = require('postmark');
const { encodeJWT } = require('../../../../routes/api/services');

async function sendResetPasswordEmail(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('-password');
  if (!user) return res.status(400).json({ error: 'No user with this email' });

  const token = await encodeJWT(user._id, '1d');

  // https://account.postmarkapp.com/servers
  // for tests
  // return res.json({ token });

  new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN)
    .sendEmailWithTemplate({
      From: process.env.ADMIN_EMAIL,
      To: email,
      TemplateAlias: 'password-reset',
      TemplateModel: {
        product_name: 'Chinese+',
        name: user.name,
        action_url: 'https://www.chineseplus.club/password-reset/' + token,
      },
    })
    .then(() => res.json({ msg: 'Письмо отправлено' }))
    .catch((e) => res.status(400).json({ error: e.message }));
}

module.exports = { sendResetPasswordEmail };
