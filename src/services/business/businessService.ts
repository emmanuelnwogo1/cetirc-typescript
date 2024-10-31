import axios from 'axios';
import * as geolib from 'geolib';
import { BusinessProfile } from '../../models/BusinessProfile';
import bcrypt from 'bcrypt';
import { Conflict, NotFound } from 'http-errors';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

export const getNearbyBusinesses = async (userLocation: { latitude: number; longitude: number }) => {
    const nearbyBusinesses: any[] = [];
    
    const businesses = await BusinessProfile.findAll();

    for (const business of businesses) {
        if (business.address && business.city && business.state && business.zip_code) {
            const address = `${business.address}, ${business.city}, ${business.state} ${business.zip_code}`;
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`;
            const geocodeResponse = await axios.get(geocodeUrl);
            const geocodeData = geocodeResponse.data;

            if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
                const businessLocation = geocodeData.results[0].geometry.location;
                const distance = geolib.getDistance(userLocation, { latitude: businessLocation.lat, longitude: businessLocation.lng });

                nearbyBusinesses.push({
                    business,
                    distance,
                    latitude: businessLocation.lat,
                    longitude: businessLocation.lng,
                });
            }
        }
    }

    // top 5 nearest businesses
    return nearbyBusinesses.sort((a, b) => a.distance - b.distance).slice(0, 5);
};

export const updateBusinessProfile = async (businessId: number, data: any) =>  {
    const businessProfile = await BusinessProfile.findByPk(businessId);

    if (!businessProfile) {
        throw new Error("Business profile not found.");
    }

    await businessProfile.update(data);
    return businessProfile.toJSON(); // Directly return the updated data object
};

export const registerBusiness = async (data: any) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        const businessProfile = await BusinessProfile.create({
            ...data,
            password: hashedPassword,
        });

        if (!businessProfile) {
            throw new NotFound('Failed to register business.');
        }

        return businessProfile;
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Conflict('Email already exists. Please use a different email.');
        }
        throw error;
    }
};