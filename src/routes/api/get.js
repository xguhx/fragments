// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const logger = require('../../logger');
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  logger.info('IM IN GET');
  let fragments;

  fragments = await Fragment.byUser(req.user, false);

  if (req.query.expand === '1') {
    fragments = await Fragment.byUser(req.user, true);
  }
  res.status(200).json(createSuccessResponse({ fragments }));
};
