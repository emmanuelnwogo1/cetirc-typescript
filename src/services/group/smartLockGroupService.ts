import { SmartLockGroup } from "../../models/SmartLockGroup";

interface CreateGroupRequest {
    name: string;
    description: string;
}

export const createGroup = async (data: CreateGroupRequest) => {
    try {

        const existingGroup = await SmartLockGroup.findOne({ where: { name: data.name } });

        if (existingGroup) {
            return {
                statusCode: 400,
                status: "failed",
                message: "Invalid input.",
                data: {
                    name: ["A smart lock group with this name already exists."]
                }
            };
        }

        const newGroup = await SmartLockGroup.create({
            name: data.name,
            description: data.description
        } as SmartLockGroup);

        return {
            statusCode: 201,
            status: "success",
            message: "SmartLockGroup created successfully.",
            data: newGroup
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: "failed",
            message: "An error occurred while creating the group.",
            data: {}
        };
    }
};
