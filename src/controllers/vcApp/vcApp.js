const controller = {
    dashboardRender: (req, res) => {
        res.render("vcApp/vcAppDashboard.handlebars", {
            layout: "vcAppLayout",
            userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
            title: "Dashboard",
            dashboard: " active",
            joinRoom: "",
            createRoom: ""
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
        res.render("vcApp/vcAppCreateRoom.handlebars", {
            layout: "vcAppLayout",
            userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
            title: "Create Room",
            dashboard: "",
            joinRoom: "",
            createRoom: " active",
            message: `<div class="row">
            <div class="col-md-8"></div>
            <div class="col-md-4">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Room Successfully Created
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>`
        })
    }

}

module.exports = controller