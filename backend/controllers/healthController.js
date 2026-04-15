const getHealth = (req, res) => {
  res.json({ status: 'ok', message: 'Creddit API is running' });
};

module.exports = { getHealth };
