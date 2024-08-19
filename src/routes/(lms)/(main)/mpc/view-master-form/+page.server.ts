export async function load({ parent }) {
    await parent();
    return {
        status: 200,
    }
}