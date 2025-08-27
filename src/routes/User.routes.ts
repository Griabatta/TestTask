import { Router, Request } from "express";
import { UserController } from "../controllers/User.controller";
import { CreateUserDto } from "../dtos/createUser.dto";
import { validateDto } from "../middleware/validation.middleware";
import { authToken, setAuthCookie } from "../middleware/auth.middleware";
import { LoginUserDto } from "../dtos/login.dto";


const router = Router();
const userController = new UserController();

router.post('/signup', validateDto(CreateUserDto),  userController.signUp);
router.post('/login', validateDto(LoginUserDto), userController.logIn, setAuthCookie);

router.get('/:id', authToken, userController.getUser);
router.get('/', authToken, userController.getUsers);
router.patch('/:id/toggle-status', authToken, userController.toggleStatus);

router.post('/logout', userController.logout);

export default router;