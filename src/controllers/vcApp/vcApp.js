const controller = {
    dashboardRender: (req, res) => {
        res.render("vcApp/vcAppDashboard.handlebars", {
            layout: "vcAppLayout",
            title: "Dashboard",
            dashboard: " active",
            joinRoom: "",
            createRoom: ""
        })
    },
    joinRoomRender: (req, res) => {
        res.render("vcApp/vcAppJoinRoom.handlebars", {
            layout: "vcAppLayout",
            title: "Join Room",
            dashboard: "",
            joinRoom: " active",
            createRoom: ""
        })
    },
    createRoomRender: (req, res) => {
        res.render("vcApp/vcAppCreateRoom.handlebars", {
            layout: "vcAppLayout",
            title: "Create Room",
            dashboard: "",
            joinRoom: "",
            createRoom: " active"
        })
    }
}

module.exports = controller