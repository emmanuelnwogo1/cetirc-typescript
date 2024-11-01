import { Request, Response } from 'express';
import { getBusinessLocations, getNearbyBusinesses, getNearestBusinesses, registerBusiness, updateBusinessProfile } from '../../services/business/businessService';
import jwt from 'jsonwebtoken';

export const nearbyBusinessesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userLocation = req.body.user_location;

        if (!userLocation) {
            res.status(400).json({ error: 'User location data is missing' });
            return;
        }

        const nearbyBusinesses = await getNearbyBusinesses(userLocation);

        res.status(200).json({
            status: 'success',
            message: 'Nearby places fetched successfully.',
            data: {
                location: userLocation,
                places: nearbyBusinesses,
            },
        });
    } catch (error) {
        console.error('Error fetching nearby businesses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const businessRegisterController = async (req: Request, res: Response): Promise<void> => {
    try {
        const businessProfile = await registerBusiness(req.body);

        // Generate the access and refresh tokens
        const accessToken = jwt.sign(
            { id: businessProfile.id, email: businessProfile.email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            { id: businessProfile.id, email: businessProfile.email },
            process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            status: 'success',
            message: 'Business registered successfully.',
            data: {
                business_id: businessProfile.id,
                withdraw_code: businessProfile.withdraw_code,
                refresh: refreshToken,
                access: accessToken,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            status: 'failed',
            message: 'Error during registration.',
            data: {},
        });
    }
}

export const updateBusinessProfileController = async (req: Request, res: Response) => {
    const businessId = parseInt(req.params.business_id, 10);
    const data = req.body;

    try {
        const updatedProfile = await updateBusinessProfile(businessId, data);

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully.',
            data: updatedProfile
        });
    } catch (error: any) {
        console.error("Update failed:", error);
        res.status(error.message === "Business profile not found." ? 404 : 400).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
}

export const getBusinessLocation = async (req: Request, res: Response) => {
    try {
        const result = await getBusinessLocations();
        res.status(result.status === 'success' ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'No valid addresses found or geocoding failed for all addresses.', data: {} });
    }
}

export const getNearestBusinessesController = async (req: Request, res: Response) => {
    const location = req.body.location;
    if (!location || location.latitude == null || location.longitude == null) {
        res.status(400).json({ status: 'failed', message: 'Latitude and longitude are required.', data: {} });
    }

    try {
        const results = await getNearestBusinesses(location.latitude, location.longitude);
        res.status(200).json({
            status: 'success',
            message: 'Nearest businesses retrieved successfully.',
            data: results
        });
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Failed to get nearest businesses.', data: {} });
    }
}

