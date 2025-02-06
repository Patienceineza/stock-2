const Inventory = require('../models/inventory');
const InventoryUnit = require('../models/InventoryUnit');
const Product = require('../models/Product');

const getInventoryItems = async (query) => {
  const { page = 1, limit = 10, search = '', product } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (search) {
    filter.$or = [
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  if (product) {
    filter.product = product;
  }

  const inventoryItems = await Inventory.find(filter)
    .populate('product')
    .populate('units')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Inventory.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const currentPage = parseInt(page);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    list: inventoryItems,
    total,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
  };
};

const getInventoryItemById = async (id) => {
  return await Inventory.findById(id).populate('product').populate('units');
};

const createInventoryUnit = async (unitData) => {
  const inventoryUnit = new InventoryUnit(unitData);
  await inventoryUnit.save();

  const inventory = await Inventory.findOne({ product: unitData.product });
  if (inventory) {
    inventory.totalQuantity += unitData.quantity;
    inventory.units.push(inventoryUnit._id);
    await inventory.save();
  } else {
    const newInventory = new Inventory({
      product: unitData.product,
      totalQuantity: unitData.quantity,
      units: [inventoryUnit._id],
    });
    await newInventory.save();
  }

  // Update summary report
  await updateSummaryReport(unitData.product);

  return inventoryUnit;
};

const getInventoryUnits = async (query) => {
  const { page = 1, limit = 10, productId } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  if (productId) {
    filter.product = productId;
  }

  const inventoryUnits = await InventoryUnit.find(filter)
    .populate('product')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await InventoryUnit.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const currentPage = parseInt(page);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    list: inventoryUnits,
    total,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
  };
};

const updateSummaryReport = async (productId) => {
  const inventory = await Inventory.findOne({ product: productId }).populate('product');
  if (inventory) {
    const summary = await Inventory.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: '$product',
          totalQuantity: { $sum: '$totalQuantity' },
        },
      },
    ]);

    if (summary.length > 0) {
      inventory.totalQuantity = summary[0].totalQuantity;
      await inventory.save();
    }
  }
};

const getSummaryReport = async () => {
  const summary = await Inventory.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $group: {
        _id: '$product',
        totalQuantity: { $sum: '$totalQuantity' },
        productName: { $first: '$productDetails.name' },
      },
    },
  ]);

  return summary;
};

module.exports = { getInventoryItems, getInventoryItemById, createInventoryUnit, getInventoryUnits, getSummaryReport };