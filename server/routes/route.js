import { Router } from "express";
import express from 'express'
import { isAuth } from "../middleware/authMiddleware.js";
import { Register, Login, FetchUser, FetchProjectMember, FetchUserDetails, GetUserProject } from "../controllers/user.js";
import { CreateWorkSpace, GetWorkspace, DeleteWorkspace } from "../controllers/workspace.js";
import { AssignMember, CreateProject, GetProject, GetProjectDetail, DeleteProject, RemoveMember } from "../controllers/project.js";
import { CreateTask, DeleteTask, GetProjectTask, GetUserTask, updateTaskStatus } from "../controllers/task.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
const route = express(Router());

//common routes
route.get('/fetch/workspace', isAuth, authorizeRoles("admin"), GetWorkspace)
route.post('/fetch/user/project', isAuth, authorizeRoles("admin", "user"), GetUserProject)
route.post('/fetch/user/task', isAuth, authorizeRoles("admin", "user"), GetUserTask)
route.post('/fetch/project', isAuth, authorizeRoles("admin", "user"), GetProject)
route.post('/fetch/project/detail', isAuth, authorizeRoles("admin", "user"), GetProjectDetail)
route.post("/fetch/project/task", isAuth, authorizeRoles("admin", "user"), GetProjectTask);
route.put("/update/task/status", isAuth, authorizeRoles("admin", "user"), updateTaskStatus);

// Auth routes
route.post('/auth/register', Register)
route.post('/auth/login', Login)

//Admin routes
route.post('/admin/create/workspace', isAuth, authorizeRoles("admin"), CreateWorkSpace)
route.post('/admin/create/project', isAuth, authorizeRoles("admin"), CreateProject)
route.post('/admin/fetch/user', isAuth, authorizeRoles("admin", "user"), FetchUser)
route.post('/admin/fetch/user-details', isAuth, authorizeRoles("admin", "user"), FetchUserDetails)
route.post('/admin/fetch/project/member', isAuth, authorizeRoles("admin"), FetchProjectMember)
route.put('/admin/assigned-member', isAuth, authorizeRoles("admin"), AssignMember)
route.put('/admin/remove-member', isAuth, authorizeRoles("admin"), RemoveMember)
route.post('/admin/create/task', isAuth, authorizeRoles("admin"), CreateTask)
route.delete('/admin/delete/task/:taskId', isAuth, authorizeRoles("admin"), DeleteTask)

route.delete('/admin/delete/project/:projectId', isAuth, authorizeRoles("admin"), DeleteProject)
route.delete('/admin/delete/workspace/:workspaceId', isAuth, authorizeRoles("admin"), DeleteWorkspace)

route.get('/', (req, res) => {
    res.send("server running ");
})
route.get("/auth/profile", isAuth, async (req, res) => {

    return res.json({
        success: true,
        user: req?.user
    });
});
export default route