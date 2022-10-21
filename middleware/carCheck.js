import { Cars } from '../models/mainModels.js';

export const countCar = async (req, res, next) => {
  try {
    const count = await Cars.count({ where: { id: req.params.id }, paranoid: true });
    console.log('count', count);
    if (count === 0) return res.send('data not found');
    next();
  } catch (error) {
    console.log(error);
  }
};

export const countDeletedCar = async (req, res, next) => {
  try {
    const count = await Cars.count({
      where: {
        id: req.params.id,
      },
      paranoid: false,
    });
    console.log('countDeletedCar', count);
    if (count === 0) return res.send('data not found');
    next();
  } catch (error) {
    console.log(error);
  }
};
