module.exports = (req, res) => {
  const { qty: limit, page } = req.query;
  const { rows: docs, count: total } = req.pagination;
  return res.json({
    docs, total, limit, page, pages: Math.ceil(total / limit),
  });
};
