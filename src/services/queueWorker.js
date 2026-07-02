const notificationQueue = require("../queue/queue");
const db = require("../db/database");

function processQueue() {
    if (notificationQueue.length === 0) {
        return;
    }

    const job = notificationQueue.shift();

    const delay = Math.floor(Math.random() * 501) + 500;

    setTimeout(() => {
        const failed = Math.random() < 0.1;

        const status = failed ? "failed" : "completed";
        const retryCount = failed ? job.retry_count + 1 : job.retry_count;

        db.run(
            `UPDATE notifications
             SET status = ?, retry_count = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [status, retryCount, job.notification_id],
            (err) => {
                if (err) {
                    console.error("Failed to update notification:", err.message);
                    return;
                }

                console.log(
                    `Notification ${job.notification_id} ${status}`
                );
            }
        );
    }, delay);
}

// Check the queue every 100ms
setInterval(processQueue, 100);

module.exports = {};