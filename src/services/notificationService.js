const db = require("../db/database");
const notificationQueue = require("../queue/queue");

function createNotification(event_id, recipient) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO notifications
            (event_id, recipient, channel, status)
            VALUES (?, ?, ?, ?)`,
            [event_id, recipient, "email", "pending"],
            function (err) {
                if (err) {
                    return reject(err);
                }

                const notification_id = this.lastID;

                notificationQueue.push({
                    notification_id,
                    retry_count: 0
                });

                resolve(notification_id);
            }
        );
    });
}

module.exports = {
    createNotification
};