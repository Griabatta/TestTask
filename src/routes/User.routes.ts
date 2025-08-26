import { Router, Request } from "express";
import { UserController } from "../controllers/User.controller";
import { CreateUserDto } from "../dtos/createUser.dto";
import { validateDto } from "../middleware/validation.middleware";
import { authToken } from "../middleware/auth.middleware";


const router = Router();
const userController = new UserController();

router.post('/signup', validateDto(CreateUserDto),  userController.signUp);
router.post('/login', userController.logIn);

router.get('/:id', authToken, userController.getUser);
router.get('/', authToken, userController.getUsers);
router.get('/:id/toggle-status', authToken, userController.toggleStatus);

export default router;