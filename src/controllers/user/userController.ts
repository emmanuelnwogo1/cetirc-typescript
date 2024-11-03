import { Request, Response } from 'express';
import { createUser, deleteUser, getUserById, getUserProfileDetails, getUsers, updateUserProfile, updateUserProfilePhoto } from '../../services/user/userService';

export const editUserProfile = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body;

    const result = await updateUserProfile(userId, data);

    if (result.status === "success") {
        res.status(200).json(result);
    } else if (result.status === "failed") {
        res.status(404).json(result);
    } else {
        res.status(400).json(result);
    }
};

export const fetchUserProfileDetails = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await getUserProfileDetails(userId);

    if (result.status === "success") {
        res.status(200).json(result);
    } else if (result.status === "failed") {
        res.status(404).json(result);
    } else {
        res.status(500).json(result);
    }
};

export const updateProfilePhotoController = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const image = req.file;

        if (!image) {
            res.status(400).json({
                status: 'failed',
                message: 'No image file uploaded.',
            });
        }else{
            const result = await updateUserProfilePhoto(userId, image);

            if (result.status === 'failed') {
                res.status(400).json(result);
            } else {
                res.status(200).json(result);
            }
        }
    } catch (error: any) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};
  
export const getUserByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
};
  
export const createUserController = async (req: Request, res: Response) => {
    try {
      const newUser = await createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: 'Bad request.' });
    }
};
  
export const deleteUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
};


