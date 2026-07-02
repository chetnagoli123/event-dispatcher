const { createEvent } = require("../services/eventService");

async function createEventHandler(req, res) {
    try {
        const { event_type, recipient, data } = req.body;

        // Validate request
        if (!event_type || !recipient) {
            return res.status(400).json({
                error: "event_type and recipient are required"
            });
        }

        const result = await createEvent(
            event_type,
            recipient,
            data || {}
        );

        return res.status(202).json({
            message: "Event accepted for processing",
            tracking_id: result.tracking_id,
            notification_id: result.notification_id,
            status: "pending"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

module.exports = {
    createEventHandler
};