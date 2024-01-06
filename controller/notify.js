const Notify = require("../model/Notify");
const Profile = require("../model/Profile");


const createNotify = async (event, userId) => {
    try {

        const notify = new Notify({
            user_id: userId,
            event: event,
        });

        await notify.save();
        return {
            success: true,
            message: "Notification Created",
            data: notify
        };
    } catch (err) {
        return console.log({ message: err.message });
    }
};

const getNotifies = async (req, res, next) => {
    try {
        const notifies = await Notify.find()
            .sort("-createdAt")
        let notifications = []
        for (let i = 0; i < notifies.length; i++) {
            const user = await Profile.findOne({ user_id: notifies[i].user_id })
            notifications.push({
                _id: notifies[i]._id,
                username: user.username,
                avatar: user.profile_image,
                event: notifies[i].event,
                isOpen: notifies[i].isOpen
            })
        }
       
        return res.status(200).json({
            success: true,
            message: "Notifications Retrieved",
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const isOpenNotify = async (req, res, next) => {
    try {
        const notifies = await Notify.findOneAndUpdate(
            { _id: req.params.id },
            {
                isOpen: true
            },
            {new: true}
            
        );
        return res.status(200).json({
            success: true,
            message: "Notification Open",
            data: notifies
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createNotify,
    getNotifies,
    isOpenNotify
}
