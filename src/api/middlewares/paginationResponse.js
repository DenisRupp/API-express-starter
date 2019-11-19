module.exports = (req, res) => {
  const { qty: limit = 10, page = 1 } = req.query;
  const { rows: docs, count: total } = req.pagination;

  return res.json({
    docs,
    total,
    limit,
    page,
    pages: Math.ceil(total / limit),
  });
};
