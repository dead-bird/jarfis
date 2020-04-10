module.exports = {
    async read(query, projection = {}, limit = 100, skip = 0, sort = { createdAt: -1 }) {
        return await process.db.collection('audits').find(query).project(projection).limit(limit).skip(skip).sort(sort).toArray();
    },
    async insert(data) {
        return await process.db.collection('audits').insertOne(data);
    }
}