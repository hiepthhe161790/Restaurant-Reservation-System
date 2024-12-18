const { UserService } = require('../services/index');
const { GuestService } = require('../services/index');
const { frontendUrl } = require('../utils/constants');


class UserController {
    /**
    * method: GET
    * router(/api/v1/user)
    * author: TienPV
    */
    getAllUsers = async (req, res, next) => {
        try {
            const guests = await GuestService.getAllGuests();
            const users = await UserService.getAllUsers();
            res.status(200).json({
                data: {
                    users,
                    guests,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/user/authenticated)
    * author: TienPV
    */
    getAllAuthenticatedUsers = async (req, res, next) => {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/user/unauthenticated)
    * author: TienPV
    */
    getAllUnauthenticatedUser = async (req, res, next) => {
        try {
            const guests = await GuestService.getAllGuests();
            res.status(200).json({
                data: guests,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/user/get-current-user)
    * author: TienPV
    */
    getCurrentUser = async (req, res, next) => {
        try {
            const user = req.user;
            return res.status(200).json({
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: POST
     * router(/api/v1/user/register-customer-account)
     * author: TienPV
     */
    registerCustomerAccount = async (req, res, next) => {
        try {
            const { fname, lname, dob, phoneNumber, email, gender, password } = req.body;
            const role = "CUSTOMER";
            const restaurant = null;
            const newUser = await UserService.signUp(fname, lname, dob, phoneNumber, email,
                gender, role, password, restaurant);
            return res.status(200).json({
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: POST
    * router(/api/v1/user/verify-email)
    * author: TienPV
    */
    verifyEmail = async (req, res, next) => {
        try {
            const { uid } = req.query;
            await UserService.verifyEmail(uid);
            return res.redirect(`${frontendUrl}/verification-success`);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: PATCH
    * router(/api/v1/user/update-customer-info)
    * author: TienPV
    */
    updateCustomerInfo = async (req, res, next) => {
        try {
            const { fname, lname, dob, phoneNumber, gender } = req.body;
            const user = req.user;
            const data = await UserService.updateCustomerInfo(fname, lname, dob, phoneNumber, gender, user?.firebaseUID);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: POST
    * router(/api/v1/user/send-email-verification)
     * author: TienPV
     */
    sendEmailVerification = async (req, res, next) => {
        try {
            const { email } = req.body;
            const data = await UserService.sendEmailVerification(email);
            return res.status(200).json(data);;
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: POST
    * router(/api/v1/user/reset-password)
    * author: TienPV
    */
    resetPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const data = await UserService.resetPassword(email);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
    getPaginatedUsers = async (req, res, next) => {
        try {
            const { page, limit, search, role } = req.query;
            const users = await UserService.getPaginatedUsers(page, limit, search, role);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
    registerAndVerifyAccount = async (req, res, next) => {
        try {
            const { fname, lname, dob, phoneNumber, email, gender, password,role } = req.body;
            const restaurant = null;
            const newUser = await UserService.signUpAndVerify(fname, lname, dob, phoneNumber, email, gender, role, password, restaurant);
            return res.status(200).json({
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }
    updateAccountInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { fname, lname, dob, phoneNumber, gender, role } = req.body;
            const data = await UserService.updateAccountInfo(id, fname, lname, dob, phoneNumber, gender, role);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
    getEmailByFirebaseUID = async (req, res, next) => {
        try {
            const { firebaseUID } = req.params;
            const email = await UserService.getEmailByFirebaseUID(firebaseUID);
            res.status(200).json({ email });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController;
