const StockHistory = require('../model/stock_history_model');

const stockHistoryController = {
  getItemStockHistory: async (req, res) => {
    try {
      const { item_code, start_date, end_date, transaction_type, invoice_type, limit, offset } = req.body;

      if (!item_code) {
        return res.status(400).json({
          success: false,
          message: 'item_code is required'
        });
      }

      const filters = {
        start_date,
        end_date,
        transaction_type,
        invoice_type,
        limit: limit || 100,
        offset: offset || 0
      };

      const history = await StockHistory.findByItemCode(item_code, filters);
      const summary = await StockHistory.getSummaryByItemCode(item_code, filters);

      res.status(200).json({
        success: true,
        data: {
          item_code,
          history,
          summary
        }
      });
    } catch (error) {
      console.error('Get Item Stock History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  getAllStockHistory: async (req, res) => {
    try {
      const { item_code, start_date, end_date, transaction_type, invoice_type, limit, offset } = req.body;

      const filters = {
        item_code,
        start_date,
        end_date,
        transaction_type,
        invoice_type,
        limit: limit || 100,
        offset: offset || 0
      };

      const history = await StockHistory.findAll(filters);

      res.status(200).json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      console.error('Get All Stock History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  getItemStockSummary: async (req, res) => {
    try {
      const { item_code, start_date, end_date } = req.body;

      if (!item_code) {
        return res.status(400).json({
          success: false,
          message: 'item_code is required'
        });
      }

      const filters = { start_date, end_date };
      const summary = await StockHistory.getSummaryByItemCode(item_code, filters);

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get Item Stock Summary Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = stockHistoryController;

