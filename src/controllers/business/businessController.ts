import { Request, Response } from 'express';
import { getNearbyBusinesses } from '../../services/business/businessService';

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
