import axios from 'axios';
import * as geolib from 'geolib';
import { BusinessProfile } from '../../models/BusinessProfile';
import bcrypt from 'bcrypt';
import { Conflict, NotFound } from 'http-errors';
import path from "path";
import fs from 'fs';
import { User } from '../../models/User';

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
    return businessProfile.toJSON();
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

export const getBusinessLocations = async () => {
    const businesses = await BusinessProfile.findAll();
    const results: any[] = [];

    for (const business of businesses) {
        const address = `${business.address}, ${business.city}, ${business.state} ${business.zip_code}`;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        try {
            const response = await axios.get(geocodingUrl);
            const data = response.data;

            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                results.push({
                    name: business.name,
                    device_id: business.device_id,
                    location
                });
            } else {
                throw new Error(`Failed to geocode address: ${address}, status: ${data.status}`);
            }
        } catch (error: any) {
            throw new Error(`Error while geocoding address: ${address}, error: ${error.message}`);
        }
    }

    return results.length > 0
        ? { status: 'success', message: 'Operation completed successfully.', data: results }
        : { status: 'failed', message: 'No valid addresses found or geocoding failed for all addresses', data: {} };
}

export const getNearestBusinesses = async (userLatitude: number, userLongitude: number) => {
    const userCoords = { latitude: userLatitude, longitude: userLongitude };
    const businesses = await BusinessProfile.findAll();
    const businessDistances: { distance: number; business: any }[] = [];

    for (const business of businesses) {
        const address = `${business.address}, ${business.city}, ${business.state} ${business.zip_code}`;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        try {
        console.log(geocodingUrl)
            const response = await axios.get(geocodingUrl);
            const data = response.data;

            if (data.status === 'OK' && data.results.length) {
                const location = data.results[0].geometry.location;
                const distance = calculateDistance(userCoords, location);

                businessDistances.push({
                    distance,
                    business: {
                        name: business.name,
                        image: business.image,
                        location
                    }
                });
            } else {
                throw new Error(`Failed to geocode address: ${address}`);
            }
        } catch (error: any) {
            throw new Error(`Error geocoding address: ${address}, error: ${error.message}`);
        }
    }

    businessDistances.sort((a, b) => a.distance - b.distance);
    return businessDistances.slice(0, 10);
}

// Helper function to calculate distance
function calculateDistance(coords1: { latitude: number; longitude: number }, coords2: { lat: number; lng: number }) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = deg2rad(coords2.lat - coords1.latitude);
    const dLng = deg2rad(coords2.lng - coords1.longitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coords1.latitude)) * Math.cos(deg2rad(coords2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export const updateBusinessProfileImage = async (userId: number, image: Express.Multer.File) => {
    try {
        if (!image || !image.path) {
            return {
                status: 'failed',
                message: 'No image file received.',
                data: {},
            };
        }

        const imageBuffer = await fs.promises.readFile(image.path);

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return {
                status: 'failed',
                message: 'Unauthorized.',
                data: {},
            };
        }

        let profile = await BusinessProfile.findOne({ where: { user_id: userId } });
        if (!profile) {
            profile = await BusinessProfile.create({ user_id: user.id } as BusinessProfile);
        }

        const fileExtension = path.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `business_image_${timestamp}${fileExtension}`;
        const imagePath = path.join(__dirname, '../../../business_images/', imageName);

        await fs.promises.writeFile(imagePath, imageBuffer);
        await fs.promises.unlink(image.path);

        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/business_images/${imageName}`;

        profile.image = `business_images/${imageName}`;
        await profile.save();

        return {
            status: 'success',
            message: 'Profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        };
    } catch (error: any) {
        console.error("Error updating business profile photo:", error);

        return {
            status: 'failed',
            message: 'An error occurred while updating the profile photo.',
            data: { error: error.message || 'Unknown error' },
        };
    }
};