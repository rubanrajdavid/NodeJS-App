const { roomData } = require("../../models/user/roomData.js");
const { Op } = require("sequelize");
const helperFunctions = {
    generateUID: (size) => {
        var string =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let OTP = "";
        var len = string.length;
        for (let i = 0; i < size; i++) {
            OTP += string[Math.floor(Math.random() * len)];
        }
        return OTP;
    },
    findParticipants: (details, email) => {
        details = details.map((detail) => {
            if (detail.PARTICIPANTS) {
                detail.PARTICIPANTS = detail.PARTICIPANTS.split(",")
            }
            return detail
        })
        var dashboardData = []
        for (i = 0; i < details.length; i++) {
            if (details[i].PARTICIPANTS.includes(email) || details[i].CREATED_BY == email) {
                dashboardData.push(details[i])
            }
        }
        return dashboardData
    }
}

const controller = {
    dashboardRender: (req, res) => {
        roomData.findAll({
            where: {
                [Op.or]: [
                    { CREATED_BY: req.user.EMAIL },
                    { PARTICIPANTS: { [Op.like]: '%' + req.user.EMAIL + '%' } }
                ]
            }, raw: true
        }).then((details) => {
            details = helperFunctions.findParticipants(details, req.user.EMAIL)
            console.log(details)
            res.render("vcApp/vcAppDashboard.handlebars", {
                layout: "vcAppLayout",
                userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
                title: "Dashboard",
                dashboard: " active",
                joinRoom: "",
                createRoom: "",
                details,
                message: req.flash('message')
            })
        })
    },
    joinRoomRender: (req, res) => {
        res.render("vcApp/vcAppJoinRoom.handlebars", {
            layout: "vcAppLayout",
            userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
            title: "Join Room",
            dashboard: "",
            joinRoom: " active",
            createRoom: ""
        })
    },
    createRoomRender: (req, res) => {
        res.render("vcApp/vcAppCreateRoom.handlebars", {
            layout: "vcAppLayout",
            userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
            title: "Create Room",
            dashboard: "",
            joinRoom: "",
            createRoom: " active"
        })
    },
    createRoom: (req, res) => {
        console.log(req.body)
        roomData.create({
            ROOM_NAME: req.body.roomName,
            CREATED_BY: req.user.EMAIL,
            PARTICIPANTS: req.body.participantEmail,
            ADMIN_ID: req.body.adminEmail,
            UID: helperFunctions.generateUID(20),
        }).then((details) => {
            console.log(details)
            req.flash('message', `<br><div class="row">
            <div class="col-md-8"></div>
            <div class="col-md-4">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Room Successfully Created
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>`);
            res.redirect('/vcapp/');
        });

    },
    deleteRoom: (req, res) => {
        roomData.destroy({
            where: {
                UID: req.params.uid,
            },
        }).then(() => {
            res.redirect("/vcapp");
        })
    },
    chatRoomRender: (req, res) => {
        roomData.findAll({
            where: {
                UID: req.params.uid
            }, raw: true
        }).then((details) => {
            if (details.length != 0) {
                res.render("vcApp/vcAppChatRoom.handlebars", {
                    layout: "vcAppLayout",
                    userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
                    userID: req.user.EMAIL,
                    roomID: req.params.uid,
                    title: "Chat Room",
                    dashboard: " active",
                    joinRoom: "",
                    createRoom: ""
                })
            }
            else if (details.length == 0) {
                req.flash('message', `<br><div class="row">
                <div class="col-md-8"></div>
                <div class="col-md-4">
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Room Dosen't Exist Please Verify the Room ID
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            </br>`);
                res.redirect('/vcapp/');
            }

        })

    }
}

module.exports = controller