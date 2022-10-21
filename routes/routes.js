import express from 'express';
import { getUsers, Register, RegisterAdmin, Login, Logout, whoAmI } from '../controller/userController.js';
import { verifyToken, isSuperadmin, isMember } from '../middleware/authChecker.js';
import { refreshToken } from '../controller/refreshToken.js';
import { createCar, deleteCar, getAllCar, getCar, getCarbyId, hardDelete, restoreDelete, updateCar } from '../controller/carController.js';

const router = express.Router();
const prefix = '/v1/api';

router.post(prefix + '/register-admin', verifyToken, isSuperadmin, RegisterAdmin);
router.get(prefix + '/users', verifyToken, isSuperadmin, getUsers);

router.post(prefix + '/register', Register);
router.post(prefix + '/login', Login);
router.get(prefix + '/whoami', verifyToken, whoAmI);
router.get(prefix + '/token', refreshToken);
router.delete(prefix + '/logout', Logout);

router.post(prefix + '/create-car', verifyToken, isMember, createCar);
router.get(prefix + '/get-car', verifyToken, isMember, getCar);
router.get(prefix + '/get-car/:id', verifyToken, isMember, getCarbyId);
router.put(prefix + '/update-car/:id', verifyToken, isMember, updateCar);
router.delete(prefix + '/delete-car/:id', verifyToken, isMember, deleteCar);

router.get(prefix + '/get-car-all', verifyToken, isSuperadmin, getAllCar);
router.delete(prefix + '/delete-car-force/:id', verifyToken, isSuperadmin, hardDelete);
router.post(prefix + '/delete-car-restore/:id', verifyToken, isSuperadmin, restoreDelete);

export default router;
