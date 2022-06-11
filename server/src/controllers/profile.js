// const { profile } = require("../../models");

// exports.getProfile = async (req, res) => {
//   try {
//     const idUser = req.user.id;

//     let data = await profile.findOne({
//       where: {
//         idUser,
//       },
//       attributes: {
//         exclude: ["createdAt", "updatedAt", "idUser"],
//       },
//     });

//     data = JSON.parse(JSON.stringify(data));

//     data = {
//       ...data,
//       image: data.image ? process.env.PATH_FILE + data.image : null,
//     };

//     res.send({
//       status: "success...",
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.send({
//       status: "failed",
//       message: "Server Error",
//     });
//   }
// };
const { profile } = require('../../models');


exports.getProfiles = async (req, res) => {
  try {
    const idUser = req.user.id;

    let data = await profile.findOne({
      where: {
        idUser,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: data.image ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { id } = req.params;

    let data = await profile.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: data.image ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
exports.addProfile = async (req, res) => {
  try {
    let data = req.body;

    data.idUser = req.user.id;
    data.image = req.file.filename;

    const newPropile = await profile.create(data);

    const profileData = await profile.findOne({
      where: {
        idUser:data.idUser,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: data.image ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    let data = req.body;

    data.idUser = req.user.id;
    data.image = req.file.filename;
    const { id } = req.params;

    await profile.update(data, {
      where: {
        id,
      }
    });
    const profileData = await profile.findOne({
      where: {
        idUser:data.idUser,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: data.image ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

