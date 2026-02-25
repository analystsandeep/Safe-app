import Dexie from 'dexie';

const db = new Dexie('AppraniumCustoms');
db.version(1).stores({
    weightProfiles: '++id, name, weights'
});

export async function saveWeights(name, weights) {
    return await db.weightProfiles.add({ name, weights });
}

export async function getWeights(id) {
    const profile = await db.weightProfiles.get(id);
    return profile ? profile.weights : null;
}

export async function getAllProfiles() {
    return await db.weightProfiles.toArray();
}

export async function updateWeights(id, weights) {
    return await db.weightProfiles.update(id, { weights });
}

export async function deleteProfile(id) {
    return await db.weightProfiles.delete(id);
}
