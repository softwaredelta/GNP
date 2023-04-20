// (c) Delta Software 2023, rights reserved.

import {addUserToGroup, createGroup} from "../app/groups";
import {createUser} from "../app/user";
import {createUserDelivery} from "../app/user-delivery";

/**
 * Make sure to specify ids so things stay consistent
 */

export async function loadSeeds() {
    try {
        // USERS
        await createUser({
            email: "test@delta.tec.mx",
            password: "test-password",
            id: "test-user",
        });
    } catch (e) {
        console.error(e);
    }

    try {
        //GROUP
        await createGroup({
            id: "dfs",
            name: "group 2",
        });
    } catch (e) {
        console.error(e);
    }

    try {
        // GROUP
        await addUserToGroup({
            userId: "test-user",
            groupId: "course-1",
        });
    } catch (e) {
        console.error(e);
    }

    try {
        // User Delivery
        await createUserDelivery({
            userId: "test-user",
            deliveryId: "delivery-1",
            dateDelivery: new Date("2021-09-01"),
            status: "Pendiente",
            fileUrl: "https://random.imagecdn.app/500/150",
        });
    } catch (error) {
        console.error(error);
    }
}
