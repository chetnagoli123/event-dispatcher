const db = require("../db/database");
const { createNotification } = require("./notificationService");

function createEvent(event_type, recipient, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);

        db.run(
            `INSERT INTO events (event_type, payload)
             VALUES (?, ?)`,
            [event_type, payload],
            async function (err) {
                if (err) {
                    return reject(err);
                }

                try {
                    const event_id = this.lastID;

                    const notification_id = await createNotification(
                        event_id,
                        recipient
                    );

                    resolve({
                        tracking_id: event_id,
                        notification_id
                    });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

module.exports = {
    createEvent
};