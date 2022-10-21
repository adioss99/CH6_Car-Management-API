import { Cars, Users } from '../models/mainModels.js';

const deleteEngine = async (req, res, params) => {
  await Cars.destroy({ where: { id: req.params.id }, force: params });
};

export const createCar = async (req, res) => {
  try {
    const { car_name, rent_price, car_type } = req.body;
    const createdBy = req.auth.userId;
    const newCar = await Cars.create({ car_name: car_name, rent_price: rent_price, car_type: car_type, createdBy: createdBy });
    res.json({ msg: 'Create car success', newCar });
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const getCar = async (req, res, params) => {
  try {
    const paranoid = params === false ? false : true;
    const cars = await Cars.findAll({
      attributes: ['id', 'car_name', 'rent_price', 'car_type', 'createdAt', 'updatedAt', 'deletedAt'],
      paranoid: paranoid,
      include: [
        { model: Users, as: 'created_by', attributes: ['id', 'name', 'email', 'roles'] },
        { model: Users, as: 'edited_by', attributes: ['id', 'name', 'email', 'roles'] },
        { model: Users, as: 'deleted_by', attributes: ['id', 'name', 'email', 'roles'] },
      ],
    });
    res.json(cars);
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const getCarbyId = async (req, res) => {
  try {
    const cars = await Cars.findOne({
      attributes: ['id', 'car_name', 'rent_price', 'car_type','createdAt','updatedAt','deletedAt'],
      where: { id: req.params.id },
      include: [
        { model: Users, as: 'created_by', attributes: ['id', 'name', 'email', 'roles'] },
        { model: Users, as: 'edited_by', attributes: ['id', 'name', 'email', 'roles'] },
        { model: Users, as: 'deleted_by', attributes: ['id', 'name', 'email', 'roles'] },
      ],
    });
    res.json(cars);
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const updateCar = async (req, res) => {
  try {
    const { car_name, rent_price, car_type } = req.body;
    const editedBy = req.auth.userId;
    await Cars.update(
      { car_name: car_name, rent_price: rent_price, car_type: car_type, editedBy: editedBy },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({ msg: 'Update car success' });
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const deleteCar = async (req, res) => {
  try {
    await Cars.update(
      { deletedBy: req.auth.userId },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    deleteEngine(req, res, false);
    res.json({ msg: 'Delete car success' });
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

// super admin
export const restoreDelete = async (req, res) => {
  try {
    Cars.restore({
      where: {
        id: req.params.id,
      },
    });
    res.json({ msg: 'Restored soft delete data' });
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const getAllCar = async (req, res) => {
  try {
    getCar(req, res, false);
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const hardDelete = async (req, res) => {
  try {
    deleteEngine(req, res, true);
    res.json({ msg: 'Hard delete success' });
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};
