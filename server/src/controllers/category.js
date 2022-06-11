const { category, productCategory,product } = require("../../models");

exports.getCategories = async (req, res) => {
  try {
    const data = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await category.findAll({
      where: {
        id,
      },
      include: {
        model: product,
        as: 'products',
        through: {
          model: productCategory,
          as: 'bridge',
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    res.send({
      status: 'success',
      data: {
        category : data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const newCategory = await category.create(req.body);

    res.send({
      status: "success...",
      data: {
        id: newCategory.id,
        name: newCategory.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const newCategory = await category.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success...",
      data: {
        id: newCategory.id,
        name: newCategory.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await category.destroy({
      where: {
        id,
      },
    });

    await productCategory.destroy({
      where: {
        idCategory: id,
      },
    });

    res.send({
      status: "success",
      message: `Delete category id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
