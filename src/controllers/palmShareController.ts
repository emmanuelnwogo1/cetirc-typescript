import { Request, Response } from 'express';
import { deletePalmShareMember, getPalmShareMembers, savePalmShareSettings, searchPalmShare, updatePalmShareMember } from '../services/palmShareService';
import { User } from '../models/User';

export const palmShareController = async (req: Request, res: Response) => {
    const { allowed_username, max_amount } = req.body;
    const ownerId = req.user.id;

    if (!allowed_username || max_amount === undefined) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid input.',
            data: {}
        });
    }

    try {
        const result = await savePalmShareSettings(ownerId, allowed_username, max_amount);
        
        if (result.status === 'failed') {
            res.status(404).json(result);
        }

        res.status(201).json(result);
    } catch (error: any) {
        console.error("Error saving palm share settings:", error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
};

export const palmShareMemmebersController = async (req: Request, res: Response): Promise<any> => {
    try {

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        if(!user){
            return res.status(200).json({
                status: 'failed',
                message: 'User not found.',
                data: {}
            });
        }

        const members = await getPalmShareMembers(user.username);
        
        return res.status(200).json({
            status: 'success',
            message: 'PalmShare members retrieved successfully.',
            data: members
        });
    } catch (error: any) {
        return res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
}

export const palmShareUpdateMemberController = async (req: Request, res: Response) => {
    const allowedUsername = req.params.allowed_username;
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    try {
        const updateData = req.body;
        const updatedMember = await updatePalmShareMember(allowedUsername, user, updateData);
        
        res.status(200).json({
            status: 'success',
            message: 'PalmShare member updated successfully.',
            data: updatedMember
        });
    } catch (error: any) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
}

export const deletePalmShareMemberController = async (req: Request, res: Response) => {
    const { allowedUsername } = req.params;
    const userId = req.user.id;

    try {
        const response = await deletePalmShareMember(allowedUsername, userId);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {},
        });
    }
}

export const searchPalmShareController = async (req: Request, res: Response) => {
    const allowedUsername = req.query.allowed_username as string;
    const dateCreated = req.query.date_created as string;

    const result = await searchPalmShare(allowedUsername, dateCreated);

    if (result.status === 'failed') {
        res.status(400).json(result);
    }else if(result.status === 'success'){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
};