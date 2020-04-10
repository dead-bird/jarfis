const auditsModel = require('./audits');
module.exports = {
    async read(query, projection = {}, limit = 100, skip = 0, sort = { createdAt: -1 }) {
        return await process.db.collection('servers').find(query).project(projection).limit(limit).skip(skip).sort(sort).toArray();
    },
    async update(query, data) {
        await auditsModel.insert({
            auditType: 'update',
            createdAt: new Date(),
            query: query,
            data: data,
            dataType: 'servers'
        });
        return await process.db.collection('servers').updateOne(query, { $set: data });
    },
    async insert(data) {
        await auditsModel.insert({
            auditType: 'insert',
            createdAt: new Date(),
            data: data,
            dataType: 'servers'
        });
        return await process.db.collection('servers').insertOne(data);
    }
}