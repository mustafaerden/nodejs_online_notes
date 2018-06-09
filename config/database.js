if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://mustafaerden:Me1054620084@ds117178.mlab.com:17178/online-notes'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/onlineNotes'}
}